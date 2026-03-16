export interface Env {
  REBUILD_HOOK_URL: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
}

const PROJECTS = [
  { name: "STLink343", uid: "e38dca3ab8a24ff3862996b420e796e3" },
  { name: "BrunTools", uid: "e2a3f561673446439b2d4b6a7ae47cc1" },
  { name: "HomeAssistant 红外遥控器", uid: "9f645a40b47a47b9a87eb08b11ddf62c" },
  { name: "WiFi温湿度计", uid: "6b526c07b7ce458d9b82691ad2913c89" },
  { name: "HomeAssistant WiFi通断器", uid: "eea15134ac154b5d998825db69c55856" },
  { name: "USB小夜灯控制器", uid: "c2a381566abd4cc183189785bfd7f4fa" },
  { name: "红外遥控器丐版", uid: "e0cc8d01eded494bb613509defdfd365" },
];

async function fetchProjectData(uid: string): Promise<any> {
  const response = await fetch(`https://oshwhub.com/api/project/${uid}`, {
    headers: {
      'Referer': 'https://oshwhub.com/',
      'Accept': 'application/json'
    }
  });
  const data = await response.json();
  
  if (data && data.success && data.result && data.result.count) {
    return {
      views: data.result.count.views,
      like: data.result.count.like || 0,
      star: data.result.count.star,
      fork: data.result.count.fork,
      watch: data.result.count.watch,
      thumb: data.result.thumb || null,
      commentsCount: data.result.comments_count || 0
    };
  }
  return null;
}

async function getFileSha(token: string, repo: string, path: string): Promise<string | null> {
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    return data.sha;
  }
  return null;
}

async function updateGitHubFile(
  token: string, 
  repo: string, 
  path: string, 
  content: string, 
  message: string,
  sha?: string
): Promise<void> {
  const body: any = {
    message,
    content: Buffer.from(content).toString('base64')
  };
  if (sha) {
    body.sha = sha;
  }
  
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${error}`);
  }
}

async function triggerRebuild(webhookUrl: string): Promise<void> {
  await fetch(webhookUrl, {
    method: 'POST'
  });
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Starting project data update...');
    
    const results: Record<string, any> = {};
    
    for (const project of PROJECTS) {
      console.log(`Fetching data for ${project.name}...`);
      const data = await fetchProjectData(project.uid);
      if (data) {
        results[project.uid] = data;
        console.log(`  - ${project.name}: ${data.views} views, ${data.star} stars`);
      }
    }
    
    const jsonContent = JSON.stringify(results, null, 2);
    const filePath = 'docs/.vitepress/theme/components/JLC/project-data.json';
    
    if (env.GITHUB_TOKEN && env.GITHUB_REPO) {
      console.log('Updating GitHub...');
      const sha = await getFileSha(env.GITHUB_TOKEN, env.GITHUB_REPO, filePath);
      await updateGitHubFile(
        env.GITHUB_TOKEN,
        env.GITHUB_REPO,
        filePath,
        jsonContent,
        'chore: 更新项目数据',
        sha || undefined
      );
      console.log('GitHub file updated!');
    }
    
    if (env.REBUILD_HOOK_URL) {
      console.log('Triggering rebuild...');
      await triggerRebuild(env.REBUILD_HOOK_URL);
      console.log('Rebuild triggered!');
    }
    
    console.log('Done!');
  }
};
