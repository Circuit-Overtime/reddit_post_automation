import dotenv from 'dotenv';
dotenv.config();
const TARGET_SUBREDDIT = 'pollinations_ai';


async function postImageToReddit(context, imagePath, imageDescription) {
  try {
    const subreddit = await context.reddit.getSubredditById(`t5_placeholder_${TARGET_SUBREDDIT}`);
    
    const title = await generateTitleFromImage(imageDescription);

    const post = await subreddit.submitImage({
      title,
      imagePath,
      preview: imageDescription,
    });

    console.log(`✓ Posted: ${title}`);
    console.log(`URL: ${post.permalink}`);
    
    return post;
  } catch (error) {
    console.error('❌ Failed to post:', error.message);
    throw error;
  }
}


export default postImageToReddit;