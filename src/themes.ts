export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Theme {
    name: string;
    imageStyle: string;
    captionTone: string;
    visualElements: string[];
    colorPalette: string[];
    promptPrefix: string;
    captionHooks: string[];
}

// Base soothing nature aesthetic - consistent across all days, aligned with Pollinations identity
const SOOTHING_BASE_STYLE = 'Soothing watercolor-inspired nature composition with flowing organic elements, soft gradients, serene ecosystem harmony. Gentle visual documentation of interconnected growth and evolution with a cute, friendly bee mascot acting as a guide.';
const SOOTHING_COLORS = ['soft sage green', 'warm cream', 'sky blue', 'gentle gold', 'muted terracotta'];
const SOOTHING_ELEMENTS = ['flowing vines', 'blooming flowers', 'interconnected roots', 'gentle light rays', 'organic growth patterns', 'ecosystem balance', 'cute bee mascot', 'bee pointing at elements'];

// Dynamic style variations for each day
const MONDAY_STYLE = 'Energetic watercolor with vibrant sunrise hues, explosive growth patterns, blooming flowers bursting with energy, dynamic light rays piercing through morning mist, with a cute energetic bee mascot enthusiastically pointing at the new growth';
const MONDAY_COLORS = ['sunrise orange', 'warm gold', 'sky blue', 'soft yellow', 'forest green'];

const TUESDAY_STYLE = 'Detailed technical nature illustration with intricate root networks, neural-like patterns in tree branches, data streams flowing like water, precision meets organic beauty, with a thoughtful bee mascot studying the diagrams and pointing out technical details';
const TUESDAY_COLORS = ['deep forest green', 'slate blue', 'bronze gold', 'silver-grey', 'emerald'];

const WEDNESDAY_STYLE = 'Surreal, dreamlike nature art with impossible plants, morphing flowers, fractals in nature, experimental colors blending organically, creative mutations of reality, with a playful, curious bee mascot exploring the creative transformations';
const WEDNESDAY_COLORS = ['sage purple', 'dusty rose', 'forest teal', 'soft sage green', 'copper bronze'];

const THURSDAY_STYLE = 'Interconnected ecosystem illustration showing symbiosis, pollination cycles in motion, creatures collaborating, intricate networks pulsing with life, harmonious complexity, with the bee mascot as the central coordinator pointing to connections and collaborations';
const THURSDAY_COLORS = ['coral peach', 'teal blue', 'sage green', 'golden orange', 'plum purple'];

const FRIDAY_STYLE = 'Celebratory nature burst with peak blooms, overflowing abundance, radiant colors at peak saturation, fireworks of flowers, triumphant growth captured mid-flourish, with a joyful bee mascot dancing among the flowers in celebration';
const FRIDAY_COLORS = ['sunset orange', 'peachy pink', 'golden yellow', 'coral rose', 'olive green'];

const SATURDAY_STYLE = 'Handcrafted garden aesthetic with visible brushstrokes, textured soil, carefully arranged plants, human-scale beauty, warm intimate cultivation captured with care, with the bee mascot as a helpful gardener, pointing out the carefully tended plants';
const SATURDAY_COLORS = ['earthy brown', 'sage green', 'rust orange', 'warm taupe', 'deep green'];

const SUNDAY_STYLE = 'Cosmic nature vista showing complete cycles, panoramic ecosystem view, all seasons visible simultaneously, convergence of all changes into one harmonious symphony, with the bee mascot as a wise guide pointing across the entire panorama';
const SUNDAY_COLORS = ['midnight blue', 'silver white', 'aurora green', 'soft indigo', 'warm gold'];

export const themes: Record<DayOfWeek, Theme> = {
    monday: {
        name: 'Momentum Monday',
        imageStyle: MONDAY_STYLE,
        captionTone: 'Inspirational, energetic, motivating developers to build',
        visualElements: ['explosive growth', 'sunrise energy', 'bursting blooms', 'dynamic light', 'awakening forest', 'morning momentum'],
        colorPalette: MONDAY_COLORS,
        promptPrefix: 'Energetic nature illustration capturing explosive momentum and vibrant new week energy:',
        captionHooks: [
            'Week sprouts: check out what\'s growing',
            'Fresh growth energy in these updates',
            'Monday blooms: incredible cultivations this week',
            'Seeds planted: see what took root',
        ],
    },

    tuesday: {
        name: 'Technical Tuesday',
        imageStyle: TUESDAY_STYLE,
        captionTone: 'Technical depth, builder-focused, nature-informed systems',
        visualElements: ['neural networks', 'root systems', 'data flows', 'intricate patterns', 'precision growth', 'technical harmony'],
        colorPalette: TUESDAY_COLORS,
        promptPrefix: 'Technical nature illustration showing deep architecture and systems evolved:',
        captionHooks: [
            'Roots deepen: technical foundations strengthened',
            'System harmony: infrastructure cultivated this week',
            'Architecture blooms: capability expansion detailed',
            'Technical terroir: engineering excellence documented',
        ],
    },

    wednesday: {
        name: 'Creative Wednesday',
        imageStyle: WEDNESDAY_STYLE,
        captionTone: 'Creative, imaginative, experimental yet soothing vibes',
        visualElements: ['creative mutations', 'experimental blooms', 'surreal plants', 'fractal flowers', 'morphing shapes', 'impossible beauty'],
        colorPalette: WEDNESDAY_COLORS,
        promptPrefix: 'Surreal creative nature composition celebrating experimental innovation:',
        captionHooks: [
            'Mid-week metamorphosis: inventive updates flourish',
            'Creative pollination: new ideas cross-breed',
            'Experimental gardens: breakthrough features planted',
            'Artistic cultivation: vision taking form',
        ],
    },

    thursday: {
        name: 'Ecosystem Thursday',
        imageStyle: THURSDAY_STYLE,
        captionTone: 'Integration-focused, community building, interconnected systems',
        visualElements: ['symbiotic relationships', 'interconnected networks', 'pollination cycles', 'collaborative growth', 'pulsing connections', 'living harmony'],
        colorPalette: THURSDAY_COLORS,
        promptPrefix: 'Interconnected ecosystem illustration showing integration and community pollination:',
        captionHooks: [
            'Ecosystem thrives: everything connects this week',
            'Pollination in progress: ideas cross-breed beautifully',
            'Community gardens: shared growth documented',
            'Symbiosis perfected: collaborative wins this week',
        ],
    },

    friday: {
        name: 'Feature Friday',
        imageStyle: FRIDAY_STYLE,
        captionTone: 'Celebratory yet serene, joyful achievements in nature context',
        visualElements: ['flourishing abundance', 'peak bloom moments', 'radiant colors', 'overflowing growth', 'triumphant blooms', 'harvest celebration'],
        colorPalette: FRIDAY_COLORS,
        promptPrefix: 'Celebratory nature masterpiece of flourishing features and fruitful achievements:',
        captionHooks: [
            'Week in full bloom: harvest of features shipped',
            'Peak pollination: cross-breed successes documented',
            'Fruition Friday: seeds grown into mighty trees',
            'Abundance harvested: see what flourished',
        ],
    },

    saturday: {
        name: 'Builders Saturday',
        imageStyle: SATURDAY_STYLE,
        captionTone: 'Community-focused, hands-on cultivation, gardener energy',
        visualElements: ['careful cultivation', 'gardener\'s work', 'tended gardens', 'textured growth', 'handcrafted beauty', 'intimate care'],
        colorPalette: SATURDAY_COLORS,
        promptPrefix: 'Handcrafted garden aesthetic celebrating the builders and gardeners tending the ecosystem:',
        captionHooks: [
            'Cultivated by gardeners: community growth this week',
            'Garden tended: careful builders shaped these updates',
            'Horticultural mastery: patient innovation blooms',
            'Ecosystem stewards: community care documented',
        ],
    },

    sunday: {
        name: 'Sunday Synthesis',
        imageStyle: SUNDAY_STYLE,
        captionTone: 'Reflective, integrative, complete ecosystem perspective',
        visualElements: ['complete cycles', 'holistic balance', 'full spectrum growth', 'cosmic harmony', 'convergence', 'panoramic symphony'],
        colorPalette: SUNDAY_COLORS,
        promptPrefix: 'Cosmic nature canvas depicting the complete week - all changes integrated into one harmonious ecosystem:',
        captionHooks: [
            'Week complete: ecosystem in balance and harmony',
            'Full spectrum growth: integrated view of all changes',
            'Synthesis Sunday: all updates woven together',
            'Harvest review: complete growth cycle documented',
        ],
    },
};

export function getCurrentDayOfWeek(): DayOfWeek {
    const day = new Date().getDay();
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


    return days[day];
}

export function getThemeForDay(day: DayOfWeek): Theme {
    return themes[day];
}

export function getCurrentTheme(): Theme {
    const day = getCurrentDayOfWeek();
    return themes[day];
}

export function getRandomCaptionHook(): string {
    const theme = getCurrentTheme();
    const randomIndex = Math.floor(Math.random() * theme.captionHooks.length);
    return theme.captionHooks[randomIndex];
}

export function buildThemedImagePrompt(prSummary: string, prObjects?: any[]): string {
    const theme = getCurrentTheme();
    const elementsStr = theme.visualElements.slice(0, 5).join(', ');
    const colorsStr = theme.colorPalette.join(', ');
    
    // Build detailed visual metaphors for each change category
    let visualMapping = '';
    let changeCount = 0;
    let textOverlay = '';
    let beeDirections = '';
    
    if (prObjects && prObjects.length > 0) {
        const categories: Record<string, { items: string[], visual: string, description: string }> = {
            'feature': { 
                items: [], 
                visual: 'NEW BLOOMS', 
                description: 'radiant new flowers sprouting, bright colorful petals unfurling'
            },
            'fix': { 
                items: [], 
                visual: 'STRENGTHENED ROOTS', 
                description: 'solid roots deepening and reinforcing foundation, cracks mending'
            },
            'perf': { 
                items: [], 
                visual: 'FLOWING ENERGY', 
                description: 'water, light, or sap flowing faster and more freely, luminous streams'
            },
            'docs': { 
                items: [], 
                visual: 'CLEAR PATHWAYS', 
                description: 'illuminated paths and clear guide lines through the ecosystem'
            },
            'other': { 
                items: [], 
                visual: 'IMPROVEMENTS', 
                description: 'overall growth and cultivation advancing'
            }
        };
        
        prObjects.forEach(pr => {
            const title = pr.title.toLowerCase();
            changeCount++;
            if (title.includes('feat') || title.includes('add')) categories['feature'].items.push(pr.title);
            else if (title.includes('fix') || title.includes('bug')) categories['fix'].items.push(pr.title);
            else if (title.includes('docs')) categories['docs'].items.push(pr.title);
            else if (title.includes('perf') || title.includes('optim')) categories['perf'].items.push(pr.title);
            else categories['other'].items.push(pr.title);
        });
        
        visualMapping = `\nVISUAL MAP OF CHANGES (each element represents real updates):`;
        let textItems: string[] = [];
        Object.entries(categories).forEach(([key, cat]) => {
            if (cat.items.length > 0) {
                visualMapping += `\n• ${cat.visual} - ${cat.items.slice(0, 2).join(', ')}. Show as: ${cat.description}`;
                textItems.push(cat.items.slice(0, 1)[0]);
            }
        });
        
        beeDirections = `\nBEE MASCOT ROLE - Our cute bee teacher:
- Position the cute bee mascot throughout the image as a guide and teacher
- The bee should be pointing with its front legs/antennae at different visual elements (NEW BLOOMS, STRENGTHENED ROOTS, FLOWING ENERGY, etc.)
- Make the bee look cheerful, helpful, and enthusiastic about the changes
- The bee should appear in multiple places, teaching about different improvements
- Use the bee to draw attention to key changes - it's pointing them out like a knowledgeable teacher on a diagram
- The bee mascot reinforces our Pollinations brand identity - keep it cute, warm, and inviting
- Let the bee's gestures naturally guide the viewer's eye through the visual story of improvements`;

        textOverlay = `\nTEXT OVERLAY - Add these change labels directly on the image with STYLISH FONTS:
- Blend text seamlessly into the composition (not bold banner, but integrated)
- Use elegant, flowing, HIGH-QUALITY typography that matches the nature aesthetic
- Font style options: mix of thin serif + bold sans-serif, or modern geometric fonts
- Place text labels near their corresponding visual elements AND near where the bee is pointing
- Use semi-transparent or blended text so it feels part of the artwork
- Key changes to display: ${textItems.slice(0, 3).join(' • ')}
- Make text glow subtly with colors from the palette: ${colorsStr}
- FONT STRATEGY: Make certain keywords POP with different font weights/styles (bold for features, italics for optimizations, elegant serif for improvements)
- The text should tell the story with style: what we built, fixed, and improved`;
    }

    return `${theme.promptPrefix}

THESE ARE THE REAL CHANGES SHIPPED (${changeCount} updates):
${prSummary}${visualMapping}${beeDirections}${textOverlay}

YOUR TASK - Create an image where these SPECIFIC changes are VISUALLY CLEAR:
- This is not generic growth - show the ACTUAL improvements we made
- Each visual element DIRECTLY represents a real technical change
- Make it obvious to viewers: "I can see what actually changed here"
- The image should tell the story of product evolution, not just pretty nature
- The cute bee mascot should be an integral part of the teaching/pointing narrative

COMPOSITION INSTRUCTIONS:
- Use ${elementsStr} as main visual metaphors
- Central focus: all ${changeCount} changes visible, integrated, and highlighted by the bee mascot
- Create visual progression: showing what was improved → how it flows through the system → the result
- Make the changes PROMINENT - they are the stars of this image, not background details
- The bee mascot guides viewers through the improvements like a knowledgeable teacher

Color strategy:
- ONLY use nature-inspired colors from this palette: ${colorsStr}
- Make different change types visually distinct through color and visual metaphor
- Ensure the viewer's eye is drawn to the specific improvements (guided by the bee)
- Create contrast so changes POP against the background

Style: ${theme.imageStyle}

Generate ONE concise image prompt (2-3 sentences max) that an AI image generator can execute to create an image where our SPECIFIC CHANGES are the focal point with our cute bee mascot pointing them out like a teacher, with stylish integrated text. ONLY output the image prompt, nothing else.`;
}

export function buildThemedCaption(generatedTitle: string): string {
    const theme = getCurrentTheme();
    const hook = getRandomCaptionHook();
    
    return `${hook}\n\n${generatedTitle}`;
}

export function getAllThemes(): Theme[] {
    return Object.values(themes);
}

export function getThemeSummary(): string {
    const theme = getCurrentTheme();
    return `
🎨 Theme: ${theme.name}
📍 Style: ${theme.imageStyle}
💭 Tone: ${theme.captionTone}
🌈 Colors: ${theme.colorPalette.join(', ')}
✨ Elements: ${theme.visualElements.join(', ')}
    `.trim();
}

