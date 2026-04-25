// openclaw-gateway-test.js
// 快速验证 EvoMate 能否连接上本地 OpenClaw Gateway
// 用法: node scripts/openclaw-gateway-test.js

import { connectToOpenClawGateway } from '../src/adapters/openclaw-gateway/openclaw-gateway-client.js';

console.log('🔌 正在尝试连接 OpenClaw Gateway...');
console.log(`   URL: ${process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789'}`);
console.log(`   Token: ${process.env.OPENCLAW_GATEWAY_TOKEN ? '(已设置)' : '(未设置，使用无认证模式)'}`);
console.log('');

try {
  const client = await connectToOpenClawGateway();
  console.log('✅ 连接成功！');

  console.log('\n📋 正在获取 Agent 列表...');
  const agents = await client.listAgents();
  if (agents.length === 0) {
    console.log('   (暂无 Agent，请先在 OpenClaw 中创建 Agent)');
  } else {
    agents.forEach(agent => {
      console.log(`   - ${agent.id}: ${agent.name ?? '(unnamed)'}`);
    });
  }

  console.log('\n🎉 OpenClaw Gateway 集成验证完成！');
  console.log('   EvoMate 将可以从真实 OpenClaw Agent 获取技能执行结果。');

  client.close();
  process.exit(0);
} catch (err) {
  console.error('\n❌ 连接失败:', err.message);
  console.log('\n📌 可能的原因：');
  console.log('   1. OpenClaw Gateway 未启动。请在 openclaw-main 目录运行: node openclaw.mjs gateway');
  console.log('   2. Token 不匹配。请设置 OPENCLAW_GATEWAY_TOKEN 环境变量。');
  console.log('   3. 端口号不同。请设置 OPENCLAW_GATEWAY_URL 环境变量。');
  console.log('\n💡 EvoMate 仍然可以在 Mock 模式下运行，不受影响。');
  process.exit(1);
}
