from typing import Dict
import os 
from dotenv import load_dotenv
load_dotenv()

def deploy_reddit_post(
    reddit_data: Dict,
    vps_host: str,
    vps_user: str,
    vps_ssh_key: str,
) -> bool:
    try:
        import paramiko
    except ImportError:
        print("  VPS: paramiko not installed")
        return False

    title = reddit_data.get("title", "")
    image_url = reddit_data.get("image", {}).get("url", "")

    if not all([title, image_url, vps_host, vps_user, vps_ssh_key]):
        print("  VPS: Missing required arguments")
        return False

    try:
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.pem') as f:
            f.write(vps_ssh_key)
            ssh_key_path = f.name
        
        os.chmod(ssh_key_path, 0o600)

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        print(f"  VPS: Connecting to {vps_user}@{vps_host}...")
        ssh.connect(
            hostname=vps_host,
            username=vps_user,
            key_filename=ssh_key_path,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )

        title_escaped = title.replace("'", "'\\''")
        url_escaped = image_url.replace("'", "'\\''")

        cmd = f"nohup /root/reddit_post_automation/bash/deploy.sh '{url_escaped}' '{title_escaped}' > /tmp/deploy.log 2>&1 &"
        print(f"  VPS: Triggering deployment script in background...")

        ssh.exec_command(cmd)
        ssh.close()
        os.unlink(ssh_key_path)

        print(f"  VPS: Deployment script triggered successfully")
        return True

    except Exception as e:
        print(f"  VPS: {type(e).__name__}: {e}")
        try:
            os.unlink(ssh_key_path)
        except:
            pass
        return False



vps_ssh_key = os.getenv("VPS_SSH_KEY", "")
if vps_ssh_key:
    vps_ssh_key = vps_ssh_key.replace("\\n", "\n")

deploy_reddit_post({
    "title": "Pollinations.ai update: Sage/Korpi.AI added, Polly bot hardened",
    "image": {
        "url": "https://gen.pollinations.ai/image/Cozy%208-bit%20pixel%20art%20infographic%20celebrating%204%20Pollinations%20updates.%20Headline%20in%20chunky%20pixel%20font%3A%20'POLLINATIONS%20-%20WEEKLY%20UPDATES'.%20Soft%20lime%20green%20(%23ecf874)%20and%20pastel%20gradient%20background.%20Bee%20mascot%20celebrating.%20Retro%20game%20UI%20panels%20showing%3A%20Add%20Sage%20to%20Social_Bots%2C%20Add%20Korpi.AI%20to%20Creative%2C%20%5BPATCH%5D%20Auto-deploy%20script%20for%20polly%20bot%20fixed%2C%20Harden%20Polly%20against%20prompt%20leakage%20and%20enforce%20independent%20thinking.%20Warm%20lighting%2C%20Stardew%20Valley%20vibes%2C%20mobile-readable.%20Nature%20elements%20like%20pixel%20flowers%20and%20vines.?model=nanobanana-pro&width=1024&height=1024&seed=42"
    },

}, os.getenv("VPS_HOST"), os.getenv("VPS_USER"), vps_ssh_key)