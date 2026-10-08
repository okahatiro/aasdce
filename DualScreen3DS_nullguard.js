/*:
 * @plugindesc DualScreen3DS - Enable and fix Corridor3D sprite rendering
 * @author GitHub Copilot
 * @help
 * Ensures Sprite_Corridor3D is properly initialized and rendered.
 * Prevents crash when advancing stages if the 3D background is not set up.
 *
 * Place this plugin BELOW DualScreen3DS.js in the Plugin Manager.
 *
 */

(() => {
  const PLUGIN_NAME = 'DualScreen3DS_Corridor3DFix';

  // Hook into the battle scene initialization to ensure Corridor3D is created
  const waitForScene = () => {
    if (!window.Scene_Battle || !window.Spriteset_Battle) {
      setTimeout(waitForScene, 50);
      return;
    }
    patchBattleScene();
  };

  const patchBattleScene = () => {
    // Patch Spriteset_Battle to ensure Corridor3D sprite is always present
    const _orig_createBattleback = Spriteset_Battle.prototype.createBattleback;
    
    Spriteset_Battle.prototype.createBattleback = function() {
      // Call original
      if (_orig_createBattleback) {
        _orig_createBattleback.call(this);
      }

      // Ensure Corridor3D is always present
      if (!this._corridor3D) {
        console.log(`[${PLUGIN_NAME}] Creating Corridor3D sprite...`);
        
        if (window.Sprite_Corridor3D) {
          this._corridor3D = new Sprite_Corridor3D();
          this.addChild(this._corridor3D);
        } else {
          console.warn(`[${PLUGIN_NAME}] Sprite_Corridor3D not found`);
        }
      }
    };

    // Patch update to safely handle Corridor3D during stage transitions
    const _orig_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
      try {
        if (_orig_update) {
          _orig_update.call(this);
        }
        
        // Ensure Corridor3D still exists after update
        if (this._corridor3D) {
          if (!this.contains(this._corridor3D)) {
            console.warn(`[${PLUGIN_NAME}] Corridor3D was removed, re-adding...`);
            this.addChild(this._corridor3D);
          }
          
          // Ensure it has valid content
          if (!this._corridor3D.bitmap) {
            const dummy = new Bitmap(Graphics.width, Graphics.height);
            dummy.fillAll('rgba(0, 0, 0, 0.5)');
            this._corridor3D.bitmap = dummy;
          }
        }
      } catch (e) {
        console.warn(`[${PLUGIN_NAME}] Error in Spriteset_Battle.update:`, e);
      }
    };

    // Intercept stage transition to handle Corridor3D refresh
    if (window.BattleManager && !window.BattleManager._copilotPatched) {
      const _orig_nextStage = BattleManager.nextStage;
      BattleManager.nextStage = function() {
        console.log(`[${PLUGIN_NAME}] Stage transitioning...`);
        
        // Get current scene
        const scene = SceneManager._scene;
        if (scene && scene._spriteset && scene._spriteset._corridor3D) {
          const corridor = scene._spriteset._corridor3D;
          console.log(`[${PLUGIN_NAME}] Refreshing Corridor3D...`);
          
          // Ensure bitmap is valid
          if (!corridor.bitmap || corridor.bitmap === null || corridor.bitmap === undefined) {
            const dummy = new Bitmap(Graphics.width, Graphics.height);
            dummy.fillAll('rgba(0, 0, 0, 0.5)');
            corridor.bitmap = dummy;
          }
          
          // Reset texture if needed
          if (corridor.texture && corridor.texture === null) {
            corridor.texture = PIXI.Texture.WHITE;
          }
        }
        
        // Call original
        if (_orig_nextStage) {
          _orig_nextStage.call(this);
        }
      };
      
      BattleManager._copilotPatched = true;
    }

    console.log(`[${PLUGIN_NAME}] Successfully patched Battle Scene`);
  };

  // Also ensure Sprite_Corridor3D has proper fallbacks
  const patchSpriteCorridor3D = () => {
    if (!window.Sprite_Corridor3D) {
      console.warn(`[${PLUGIN_NAME}] Sprite_Corridor3D not available`);
      return;
    }

    const proto = Sprite_Corridor3D.prototype;

    // Override initialize to ensure valid state
    const _orig_init = proto.initialize;
    proto.initialize = function() {
      if (_orig_init) {
        _orig_init.call(this);
      }

      // Fallback: ensure bitmap exists
      if (!this.bitmap) {
        this.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
      }

      // Fallback: ensure texture exists
      if (!this.texture) {
        this.texture = PIXI.Texture.WHITE;
      }
    };

    // Safe bitmap setter
    proto.setBitmap = proto.setBitmap || function(bitmap) {
      if (!bitmap) {
        this.bitmap = new Bitmap(1, 1);
        this.bitmap.fillAll('rgba(0, 0, 0, 0)');
      } else {
        this.bitmap = bitmap;
      }
    };

    console.log(`[${PLUGIN_NAME}] Patched Sprite_Corridor3D`);
  };

  // Start patching
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      waitForScene();
      setTimeout(patchSpriteCorridor3D, 100);
    });
  } else {
    waitForScene();
    setTimeout(patchSpriteCorridor3D, 100);
  }
})();
