import { Devvit } from '@devvit/public-api';
import {getPRsAndCreatePrompt, generateImage, generateTitleFromPRs } from './pipeline.ts';


Devvit.addMenuItem({
  label: 'Post Pollinations Image',
  location: 'subreddit',
  onPress: async (_, context) => {
    try {
      const githubToken = await context.settings.get('github_token');
      const pollactionsToken = await context.settings.get('pollinations_token');
      
      if (!githubToken) {
        throw new Error('GitHub token not configured. Please set it in app settings.');
      }
      if (!pollactionsToken) {
        throw new Error('Pollinations token not configured. Please set it in app settings.');
      }
      
      const promptData = await getPRsAndCreatePrompt(githubToken as string, pollactionsToken as string);
      const imageData = await generateImage(promptData.prompt, pollactionsToken as string);
      const title = await generateTitleFromPRs(promptData.summary, String(promptData.prCount), pollactionsToken as string);

      const imageAsset = await context.media.upload({
      url: imageData.url,
      type: 'image',
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await context.reddit.submitPost({
      subredditName: context.subredditName ?? 'pollinations_ai',
      title: title,
      kind: 'image',
      imageUrls: [imageAsset.mediaUrl],
      });

      context.ui.showToast('Image posted successfully!');
    }
    
    catch (error) {
      if (error instanceof Error && error.message.includes('is being created asynchronously')) {
        context.ui.showToast('Image posted! Processing on Reddit...');
      } else {
        console.error('Upload failed:', error);
        context.ui.showToast('Failed to upload image to Reddit.');
      }
    }
  },
});

export default Devvit;
