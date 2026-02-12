from typing import Dict
import io 
import base64
import os 
from dotenv import load_dotenv
import paramiko
load_dotenv()

def deploy_reddit_post(
    reddit_data: Dict,
    vps_host: str,
    vps_user: str,
    pkey: paramiko.PKey,
) -> bool:

    title = reddit_data.get("title", "")
    image_url = reddit_data.get("image", {}).get("url", "")

    if not all([title, image_url, vps_host, vps_user, pkey]):
        print("  VPS: Missing required arguments")
        return False

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        print(f"  VPS: Connecting to {vps_user}@{vps_host}...")

        ssh.connect(
            hostname=vps_host,
            username=vps_user,
            pkey=pkey,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )

        title_escaped = title.replace("'", "'\\''")
        url_escaped = image_url.replace("'", "'\\''")

        cmd = f"nohup /root/reddit_post_automation/bash/deploy.sh '{url_escaped}' '{title_escaped}' > /tmp/deploy.log 2>&1 &"

        ssh.exec_command(cmd)
        ssh.close()

        print("  VPS: Deployment script triggered successfully")
        return True

    except Exception as e:
        print(f"  VPS: {type(e).__name__}: {e}")
        return False


b64 = os.getenv("VPS_SSH_KEY_B64", "").strip()
if not b64:
    raise ValueError("Missing VPS_SSH_KEY_B64")

private_key_str = base64.b64decode(b64).decode("utf-8")

key_file = io.StringIO(private_key_str)
pkey = paramiko.Ed25519Key.from_private_key(key_file)

deploy_reddit_post({
    "title": "Pollinations.ai update: Sage/Korpi.AI added, Polly bot hardened",
    "image": {
        "url": "https://gen.pollinations.ai/image/Cozy%208-bit%20pixel%20art%20infographic%20celebrating%204%20Pollinations%20updates.%20Headline%20in%20chunky%20pixel%20font%3A%20'POLLINATIONS%20-%20WEEKLY%20UPDATES'.%20Soft%20lime%20green%20(%23ecf874)%20and%20pastel%20gradient%20background.%20Bee%20mascot%20celebrating.%20Retro%20game%20UI%20panels%20showing%3A%20Add%20Sage%20to%20Social_Bots%2C%20Add%20Korpi.AI%20to%20Creative%2C%20%5BPATCH%5D%20Auto-deploy%20script%20for%20polly%20bot%20fixed%2C%20Harden%20Polly%20against%20prompt%20leakage%20and%20enforce%20independent%20thinking.%20Warm%20lighting%2C%20Stardew%20Valley%20vibes%2C%20mobile-readable.%20Nature%20elements%20like%20pixel%20flowers%20and%20vines.?model=nanobanana-pro&width=1024&height=1024&seed=42"
    },

}, os.getenv("VPS_HOST"), os.getenv("VPS_USER"), pkey)