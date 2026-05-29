import { expect, test, describe } from 'vitest';
import { GAME_SCENES } from '../src/data/chapters';

describe('三国外交与剧情情节点数据合规性校验 (GAME_SCENES Integrity Test)', () => {
  test('每一个 GAME_SCENE 都必须包含完整的必要字段 (id, chapterId, title, narration, historicalFact)', () => {
    Object.keys(GAME_SCENES).forEach((sceneId) => {
      const scene = GAME_SCENES[sceneId];
      
      expect(scene, `情节点 ${sceneId} 未定义或为空`).toBeDefined();
      expect(scene.id, `情节点 ${sceneId} 缺少 'id' 字段`).toBeDefined();
      expect(scene.id).toBe(sceneId); // The key should match internal ID
      
      expect(scene.chapterId, `情节点 ${sceneId} 缺少 'chapterId' 字段`).toBeDefined();
      expect(typeof scene.chapterId).toBe('string');
      
      expect(scene.title, `情节点 ${sceneId} 缺少 'title' 字段`).toBeDefined();
      expect(typeof scene.title).toBe('string');
      
      expect(scene.narration, `情节点 ${sceneId} 缺少 'narration' 字段`).toBeDefined();
      expect(typeof scene.narration).toBe('string');
      expect(scene.narration.trim().length, `情节点 ${sceneId} 'narration' 字段内容不能为空`).toBeGreaterThan(0);
      
      expect(scene.historicalFact, `情节点 ${sceneId} 缺少 'historicalFact' 字段`).toBeDefined();
      expect(typeof scene.historicalFact).toBe('string');
      expect(scene.historicalFact.trim().length, `情节点 ${sceneId} 'historicalFact' 字段内容不能为空`).toBeGreaterThan(0);
    });
  });
});
