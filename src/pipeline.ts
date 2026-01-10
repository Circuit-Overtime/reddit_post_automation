import { privateEncrypt } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const POLLINATIONS_IMAGE_API = 'https://gen.pollinations.ai/image';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
const POLLINATIONS_API = 'https://gen.pollinations.ai/v1/chat/completions';
const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 5;

function getPreviousDayRange() {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    
    return {
        startDate,
        endDate,
    };
}


async function getMergedPRsFromPreviousDay(owner : any = 'pollinations', repo : any = 'pollinations', githubToken : string) {
    if (!githubToken) {
        throw new Error('GitHub token is required');
    }

    const { startDate, endDate } = getPreviousDayRange();
    const dateString = startDate.toISOString().split('T')[0];

    const query = `
        query($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        pullRequests(
          states: MERGED
          first: 100
          after: $cursor
          orderBy: {field: UPDATED_AT, direction: DESC}
          baseRefName: "main"
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            number
            title
            body
            url
            mergedAt
            updatedAt
            author {
              login
            }
            labels(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
    `;

    const headers = {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
    };

    const allPRs = [];
    let cursor = null;

    console.log(`\n=== Fetching PRs from ${dateString} ===`);
    console.log(`Time range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    let pageNum = 1;

    while (true) {
        const variables : object = {
            owner,
            repo,
            cursor,
        };

        try {
            const response = await fetch(GITHUB_GRAPHQL_API, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            const data = await response.json();

            if ((data as any).errors) {
                console.error('GraphQL errors:', (data as any).errors);
                break;
            }

            const prData = (data as any).data.repository.pullRequests;
            const nodes = prData.nodes;
            const pageInfo = prData.pageInfo;

            console.log(`  Page ${pageNum}: fetched ${nodes.length} PRs`);

            for (const pr of nodes) {
                const mergedDate = new Date(pr.mergedAt);

                if (mergedDate >= startDate && mergedDate < endDate) {
                    allPRs.push({
                        number: pr.number,
                        title: pr.title,
                        body: pr.body || '',
                        url: pr.url,
                        author: pr.author?.login || 'unknown',
                        labels: pr.labels?.nodes?.map((l : any) => l.name) || [],
                        mergedAt: pr.mergedAt,
                    });
                } else if (mergedDate < startDate) {
                    console.log(`  Stopping: reached PRs before ${dateString}`);
                    pageNum = 999;
                    break;
                }
            }

            if (!pageInfo.hasNextPage || pageNum > 100) break;

            cursor = pageInfo.endCursor;
            pageNum++;
            if (allPRs.length == 0) {
                return
            }
        } catch (error) {
            console.error('Fetch error:', error);
            break;
        }
    }


    console.log(`Found ${allPRs.length} merged PRs from previous day\n`);
    return { prs: allPRs, dateString };
}

async function createImagePrompt(prs : any[], dateString: string, pollactionsToken : string) {
    if (!prs || prs.length === 0) {
        return {
            prompt: 'Pollinations: A free, open-source AI image generation platform with community updates',
            summary: 'No specific updates from previous day',
            prCount: 0,
            highlights: [],
        };
    }

    const prList = prs.slice(0, 10).map(pr => pr.title).join(', ');

    const systemPrompt = `Output SHORT image prompt (2-3 sentences). Create nature-themed comic flowchart with updates as distinct natural elements (flowers, trees, creatures, vines). Bug fixes=pruned branches, Features=blooming flowers, Refactors=reorganized paths, Infrastructure=nesting animals. Bright comic style: emerald, golden, sky blue, orange, purple. Dynamic energy: wind, pollen, water, bee flight paths. Strip all dates, counts, metrics. ONLY output the image prompt.`
    const userPrompt = `Nature-themed comic flowchart: ${prList}
Short prompt only. No dates, counts, metadata.`

    try {
        console.log('Generating merged prompt using Pollinations API...');
        
        const response = await fetch(POLLINATIONS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${pollactionsToken}`,
            },
            body: JSON.stringify({
                model: 'openai-large',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 250,
                seed: 42,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.warn(`API warning: ${response.status} - ${JSON.stringify(errorData).substring(0, 200)}`);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const generatedPrompt = (data as any).choices?.[0]?.message?.content?.trim();
        if (!data)
        {
            console.log("No data returned from Pollinations API");
        }
        if (!generatedPrompt) {
            throw new Error('No prompt generated from API');
        }

        const highlights = prs
            .slice(0, 8)
            .map(pr => {
                const title = pr.title.toLowerCase();
                let category = 'update';
                if (title.includes('fix') || title.includes('bug')) category = 'bug fix';
                else if (title.includes('feat') || title.includes('add')) category = 'feature';
                else if (title.includes('docs')) category = 'documentation';
                else if (title.includes('perf') || title.includes('optim')) category = 'optimization';
                return `${category}: ${pr.title}`;
            });

        const summary = `
${prs.length} PRs merged:
${highlights.map(h => `• ${h}`).join('\n')}
        `.trim();

        console.log('✓ Prompt generated successfully\n');
        console.log('Generated Prompt:');
        console.log(generatedPrompt);
        console.log('');

        return {
            prompt: generatedPrompt,
            summary,
            prCount: prs.length,
            highlights,
            prs: prs.map(p => ({ number: p.number, title: p.title, url: p.url })),
            dateString,
        };
    } catch (error) {
        console.warn(`Prompt generation failed: ${(error as any).message}`);
        console.log('Falling back to local prompt generation...\n');

        const comicPrompt = `Comic book style illustration celebrating ${prs.length} Pollinations updates:
${prs.slice(0, 5).map(p => p.title).join(', ')}.
Dynamic composition with bees pollinating code flowers, bright colors, retro comic aesthetic.
Write in pure plain text, no metadata or extra commentary or markdown`;

        const highlights = prs
            .slice(0, 8)
            .map(pr => {
                const title = pr.title.toLowerCase();
                let category = 'update';
                if (title.includes('fix') || title.includes('bug')) category = 'bug fix';
                else if (title.includes('feat') || title.includes('add')) category = 'feature';
                else if (title.includes('docs')) category = 'documentation';
                else if (title.includes('perf') || title.includes('optim')) category = 'optimization';
                return `${category}: ${pr.title}`;
            });

        return {
            prompt: comicPrompt,
            summary: `${prs.length} PRs merged (fallback)`,
            prCount: prs.length,
            highlights,
            prs: prs.map(p => ({ number: p.number, title: p.title, url: p.url })),
            dateString,
        };
    }
}

async function getPRsAndCreatePrompt(githubToken : string, pollactionsToken : string) {
    try {
        const result = await getMergedPRsFromPreviousDay('pollinations', 'pollinations', githubToken);
        
        if (!result || !result.prs || result.prs.length === 0) {
            console.log('ℹ️  No merged PRs found in the previous day. Exiting pipeline.');
            process.exit(0);
        }
        
        const { prs, dateString } = result;
        const promptData = await createImagePrompt(prs, dateString, pollactionsToken);
        console.log('\n=== Generated Image Prompt ===');
        console.log(promptData.prompt);
        console.log('\n');

        return promptData;
    } catch (error) {
        console.error('Error fetching PRs:', error);
        throw error;
    }
}


async function generateTitleFromPRs(prSummary : string, prCount : string, pollactionsToken : string, dateString: string = '') {
    try {
        const dateFormatted = dateString ? `[${dateString}]` : '';
        const systemPrompt = `You are a Reddit post title generator for Pollinations, an open-source AI platform. Generate a compelling title (max 13 words) that:
1. Creates FOMO by highlighting exclusive early access to new AI capabilities
2. Mentions entering enter.pollinations.ai to register and try new features
3. Emphasizes building projects and getting featured
4. Includes the date in format provided
5. Uses "Pollinations" branding naturally
6. Is suitable for fundraising - exciting yet authentic
Avoid emojis. Create urgency and opportunity-focused messaging.`;
        const userPrompt = `Generate a Reddit title for this dev update from ${dateString}:
${prSummary}

The goal is to drive registrations to enter.pollinations.ai and create FOMO about new AI features and opportunities to get featured.
Put the date somewhere in the middle with a funny context, make it amusing, funny witty and kinda which triggers curiosity.`;

        const response = await fetch(POLLINATIONS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${pollactionsToken}`,
            },
            body: JSON.stringify({
                model: 'openai-large',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.8,
                max_tokens: 250,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        let title = (data as any).choices?.[0]?.message?.content?.trim() || '';
        
        title = title.replace(/^["']|["']$/g, '').trim();
        
        if (!title || title.length < 5) {
            title = `Pollinations: New AI Powers Unlock ${dateFormatted} - Register at enter.pollinations.ai for Early Access`;
        }

        return title;
    } catch (error) {
        console.error('PR title generation failed:', (error as any).message);
        const dateFormatted = dateString ? `[${dateString}]` : '';
        return `Pollinations: What's New in AI? ${dateFormatted} - Build, Share, Get Featured at enter.pollinations.ai`;
    }
}

async function generateImage(prompt : string, pollactionsToken : string, attempt = 0) {
    if (attempt > 0) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`  Retrying in ${delay}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay * 1000));
    }

    try {
        const URL = `${POLLINATIONS_IMAGE_API}/${encodeURIComponent(prompt)}?model=nanobanana&width=1024&height=1024&seed=42`;
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${pollactionsToken}`,
            },
            signal: AbortSignal.timeout(120000),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        console.log(`URL: ${URL}`);
        return {
                buffer: Buffer.from(await response.arrayBuffer()),
                url: URL
        }
    } catch (error) {
        if (attempt < MAX_RETRIES - 1) {
            console.log(`  ✗ Attempt ${attempt + 1} failed: ${(error as any).message}`);
            return generateImage(prompt, pollactionsToken, attempt + 1);
        }
        throw error;
    }
}


const githubToken = process.env.GITHUB_TOKEN
const pollinationsToken = process.env.POLLINATIONS_TOKEN

if (!githubToken) {
throw new Error('GitHub token not configured. Please set it in app settings.');
}
if (!pollinationsToken) {
throw new Error('Pollinations token not configured. Please set it in app settings.');
}

(async () => {
// const promptData = await getPRsAndCreatePrompt(githubToken as string, pollinationsToken as string);
// const imageData = await generateImage(promptData.prompt, pollinationsToken as string);
const promptData = {
    summary: 'Bright comic-style nature flowchart where each update is a distinct element: blooming flowers for improved model selection UI (dual names, better tooltip), Vertex AI migration, backfill priority/options, and dynamic pricing from real usage data; pruned branches for Polar sandbox token/dev setup and API docs schema cleanup; reorganized vine paths for switching to Mermaid diagrams; nesting animals for infrastructure/config cleanups and moving the profile README. Use emerald, golden, sky blue, orange, purple with dynamic wind swirls, drifting pollen, flowing water arrows, and bee flight paths connecting each node.',
    prCount: 13,
    highlights: [],
    prs: [],
    dateString: new Date().toISOString().split('T')[0],
};
const TITLE = await generateTitleFromPRs(promptData.summary, String(promptData.prCount), pollinationsToken as string, promptData.dateString || new Date().toISOString().split('T')[0]);
console.log('Final Results:');
console.log(`Title: ${TITLE}`);
// console.log(`Image URL: ${imageData.url}`);
// const fs = await import('fs');
// const linkTsPath = new URL('link.ts', import.meta.url);
// const updatedLinkTs = `
// const LINK = "${imageData.url}";
// const TITLE = "${TITLE}";
// export {LINK, TITLE};
// `;

// fs.writeFileSync(linkTsPath, updatedLinkTs, 'utf-8');
// console.log('\n✓ link.ts updated successfully');
})();

