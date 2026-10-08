//=============================================================================
// DualScreen3DS.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.5 3DS風2画面(上400x240 / 下320x240)+ 妖怪ウォッチ風バトルホイール統合版。ホイールは下画面に表示します。
 * @author DualScreen3DS
 *
 * @param bottomScenes
 * @text 下画面UIにするシーン
 * @type string[]
 * @desc ここに挙げたシーン(継承含む)は、ウィンドウを下画面に配置しレイアウト枠も下画面(320x240)基準になります。
 * @default ["Scene_Title","Scene_Menu","Scene_Item","Scene_Skill","Scene_Equip","Scene_Status","Scene_Options","Scene_Save","Scene_Load","Scene_GameEnd","Scene_Shop","Scene_Name","Scene_Battle"]
 *
 * @param windowRules
 * @text ウィンドウ個別割り当て
 * @type struct<WindowRule>[]
 * @desc シーンの既定より優先して、ウィンドウクラス単位で表示先画面を指定します(上から順に判定)。
 * @default ["{\"pattern\":\"^Window_BattleLog$\",\"screen\":\"top\"}"]
 *
 * @param uiMargin
 * @text UI余白(px)
 * @type number
 * @min 0
 * @desc 各画面の四辺に取る余白。ツクールMZ標準は4です。
 * @default 4
 *
 * @param gap
 * @text 上下画面の間隔(px)
 * @type number
 * @min 0
 * @desc 実機のヒンジ部分の表現用。0なら400x480でぴったり接します。
 * @default 0
 *
 * @param uiFontSize
 * @text 文字サイズ
 * @type number
 * @min 0
 * @desc 全ウィンドウの標準文字サイズ。0ならデータベースの設定値を使います。(MZ標準は26)
 * @default 20
 *
 * @param uiLineHeight
 * @text 行の高さ
 * @type number
 * @min 0
 * @desc ウィンドウ1行の高さ。0ならMZ標準(36)のまま。文字サイズに合わせて詰めます。
 * @default 26
 *
 * @param uiPadding
 * @text ウィンドウ内側の余白
 * @type number
 * @min 0
 * @desc ウィンドウ枠と中身の間の余白。0ならMZ標準(12)のまま。
 * @default 8
 *
 * @param uiItemPadding
 * @text 項目の左右余白
 * @type number
 * @min 0
 * @desc 項目内の左右の余白。0ならMZ標準(8)のまま。
 * @default 6
 *
 * @param screenScale
 * @text 表示倍率
 * @type number
 * @decimals 2
 * @min 0.5
 * @desc ウィンドウ/画面の表示倍率。1.5なら600x720で表示します(内部解像度は400x480のまま)。
 * @default 1.5
 *
 * @param pixelated
 * @text ドットをくっきり表示
 * @type boolean
 * @desc 拡大時にぼかさず、ニアレストネイバーで表示します。
 * @default true
 *
 * @param bezelColor
 * @text 枠(ベゼル)の色
 * @type string
 * @default #000000
 *
 * @param bottomBackColor
 * @text 下画面の背景色
 * @type string
 * @default #0b0f1a
 *
 * @param bottomBackImage
 * @text 下画面の背景画像
 * @type file
 * @dir img/system
 * @desc 指定すると320x240に合わせて下画面背景に描画します。
 *
 * @param mapTouchTopOnly
 * @text マップのタッチ移動は上画面のみ
 * @type boolean
 * @default true
 *
 * @param wheelEnabled
 * @text 【ホイール】バトルホイールを使う
 * @type boolean
 * @desc 妖怪ウォッチ2風バトルホイールを有効にします。無効ならホイール関連の処理は一切入りません。
 * @default true
 *
 * @param wheelX
 * @text 【ホイール】中心X(下画面内)
 * @type number
 * @default 160
 *
 * @param wheelY
 * @text 【ホイール】中心Y(下画面内)
 * @type number
 * @default 120
 *
 * @param wheelRadius
 * @text 【ホイール】半径(顔の配置半径)
 * @type number
 * @default 62
 *
 * @param faceRadius
 * @text 【ホイール】顔アイコン半径
 * @type number
 * @default 22
 *
 * @param rowX
 * @text 【上画面】味方配置の中心X
 * @type number
 * @desc 戦闘フィールド(上画面のUI枠)内の座標です。
 * @default 196
 *
 * @param rowY
 * @text 【上画面】味方配置のY(足元)
 * @type number
 * @default 200
 *
 * @param rowWidth
 * @text 【上画面】味方配置の横幅(半径)
 * @type number
 * @default 100
 *
 * @param rowDepth
 * @text 【上画面】弧の高さ
 * @type number
 * @default 14
 *
 * @param wheelImage
 * @text 【ホイール】背景画像
 * @type file
 * @dir img/system
 *
 * @param fitImage
 * @text 【ホイール】背景画像を円に合わせて拡縮
 * @type boolean
 * @default true
 *
 * @param frontZone
 * @text 【ホイール】前列を強調(後列側を暗くする)
 * @desc 背景画像未指定のときのみ有効
 * @type boolean
 * @default true
 *
 * @param sectorColors
 * @text 【ホイール】6区画の色(背景画像未指定時)
 * @desc #RRGGBB形式で6色。区画は席1~6の順で、キャラと一緒に回転します
 * @type string[]
 * @default ["#f7a531","#9ad64a","#33b8ea","#8c6ee6","#ee5f80","#f2d443"]
 *
 * @param faceStyle
 * @text 【ホイール】アクター表示方式
 * @type select
 * @option 円形アイコン(従来)
 * @value icon
 * @option ポートレート(SVキャラを大きく表示)
 * @value portrait
 * @option 顔グラ扇形(顔グラを区画の形に切り抜いて敷き詰め)
 * @value sector
 * @default icon
 *
 * @param portraitSize
 * @text 【ホイール】ポートレートの大きさ(px)
 * @desc ポートレート方式のときのみ有効。
 * @type number
 * @default 60
 *
 * @param hpGradient
 * @text 【ホイール】HPバーのグラデーション
 * @type boolean
 * @default true
 *
 * @param staminaMax
 * @text 【スタミナ】最大値
 * @type number
 * @min 1
 * @default 100
 *
 * @param staminaBaseCost
 * @text 【スタミナ】消費ベース値
 * @type number
 * @min 0
 * @default 10
 * @desc 行動ごとのスタミナ消費の基準値。個別設定がない行動に使用します。
 *
 * @param staminaFrontRecovery
 * @text 【スタミナ】前衛回復量/秒
 * @type number
 * @decimals 2
 * @min 0
 * @default 2
 *
 * @param staminaBackRecovery
 * @text 【スタミナ】後衛回復量/秒
 * @type number
 * @decimals 2
 * @min 0
 * @default 6
 * @desc 後衛は前衛より速く回復します。
 *
 * @param staminaMinSpeedRate
 * @text 【スタミナ】0時の攻撃速度倍率
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.5
 * @desc スタミナ0での攻撃速度。1.00なら速度低下なし。
 *
 * @param staminaMinDefRate
 * @text 【スタミナ】0時の防御倍率
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.6
 * @desc スタミナ0での防御力。1.00なら防御力低下なし。
 *
 * @param staminaActionCosts
 * @text 【スタミナ】行動別消費量
 * @type struct<StaminaActionCost>[]
 * @desc スキルIDごとの消費量。未指定のスキルは消費ベース値を使用します。
 * @default []
 *
 * @param enemyFit
 * @text 【敵】位置と大きさを上画面に合わせる
 * @type boolean
 * @desc 敵の配置(データベースのトループ座標)を、基準解像度から上画面に縮小して合わせます。
 * @default true
 *
 * @param enemyRefWidth
 * @text 【敵】トループ座標の基準幅
 * @type number
 * @default 816
 *
 * @param enemyRefHeight
 * @text 【敵】トループ座標の基準高さ
 * @type number
 * @default 624
 *
 * @param enemyScale
 * @text 【敵】画像の拡大率
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @param buttonsEnabled
 * @text 【ボタン】戦闘の4ボタンを使う
 * @type boolean
 * @desc 戦闘中、下画面のホイール以外の部分を四分割して4つのボタンにします(ホイール有効時のみ)。
 * @default true
 *
 * @param wheelButtons
 * @text 【ボタン】各ボタンの設定
 * @type struct<WheelButton>[]
 * @desc 順番は 1:左上 / 2:右上 / 3:左下 / 4:右下。画像を指定すると画像表示になります(当たり判定は形のまま)。
 * @default ["{\"label\":\"わざ\",\"color1\":\"#58b4ff\",\"color2\":\"#1c4fb4\",\"image\":\"\",\"imageFocus\":\"\",\"imagePress\":\"\"}","{\"label\":\"ねらう\",\"color1\":\"#4fd0f0\",\"color2\":\"#1a78c8\",\"image\":\"\",\"imageFocus\":\"\",\"imagePress\":\"\"}","{\"label\":\"おはらい\",\"color1\":\"#ffb347\",\"color2\":\"#d4621a\",\"image\":\"\",\"imageFocus\":\"\",\"imagePress\":\"\"}","{\"label\":\"アイテム\",\"color1\":\"#7ed957\",\"color2\":\"#2e8e32\",\"image\":\"\",\"imageFocus\":\"\",\"imagePress\":\"\"}"]
 *
 * @param buttonImageClip
 * @text 【ボタン】画像をボタンの形で切り抜く
 * @type boolean
 * @desc ONなら、画像をボタンの形(ホイールの円に沿った形)で切り抜き、ホイール側にはみ出さないようにします。
 * @default true
 *
 * @param buttonImageFit
 * @text 【ボタン】画像のフィット方法
 * @type select
 * @option 引き伸ばす(ボタンいっぱい)
 * @value stretch
 * @option 全体が収まるように縮小(余白が出る)
 * @value contain
 * @option 隙間なく覆うように拡大(はみ出す分は切り取り)
 * @value cover
 * @desc 画像のサイズ比がボタンと違うときの扱いです。
 * @default stretch
 *
 * @param buttonFontSize
 * @text 【ボタン】文字サイズ
 * @type number
 * @min 8
 * @desc ボタンに収まらない場合は自動で小さくなります。
 * @default 22
 *
 * @param buttonGap
 * @text 【ボタン】ボタン同士の間隔(px)
 * @type number
 * @min 0
 * @default 3
 *
 * @param buttonEdge
 * @text 【ボタン】画面端の余白(px)
 * @type number
 * @min 0
 * @default 2
 *
 * @param buttonInnerGap
 * @text 【ボタン】ホイールとの隙間(px)
 * @type number
 * @min 0
 * @default 4
 *
 * @param buttonSe
 * @text 【ボタン】効果音を鳴らす
 * @type boolean
 * @desc フォーカス時にカーソルSE、決定時に決定SEを鳴らします。
 * @default true
 *
 * @param bottomPictureFrom
 * @text 【ピクチャ】下画面に出す番号(開始)
 * @type number
 * @min 0
 * @desc この番号〜終了番号のピクチャを下画面に表示します。0なら範囲指定なし(全て上画面)。
 * @default 51
 *
 * @param bottomPictureTo
 * @text 【ピクチャ】下画面に出す番号(終了)
 * @type number
 * @min 0
 * @default 100
 *
 * @command setPictureScreen
 * @text ピクチャの表示先画面
 * @desc ピクチャ番号ごとに表示先(上/下画面)を指定します。座標は各画面の左上が原点です。
 *
 * @arg startId
 * @text 開始番号
 * @type number
 * @min 1
 * @default 1
 *
 * @arg endId
 * @text 終了番号(0なら開始番号のみ)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg screen
 * @text 表示先
 * @type select
 * @option 上画面
 * @value top
 * @option 下画面
 * @value bottom
 * @option 自動(番号の範囲設定に従う)
 * @value auto
 * @default bottom
 *
 * @param titleUiEnabled
 * @text 【タイトル】下画面UIを画像ボタン化
 * @type boolean
 * @desc タイトルコマンド(ニューゲーム等)を、下画面のボタンUIに置き換えます。
 * @default true
 *
 * @param titleButtons
 * @text 【タイトル】ボタンごとの画像設定
 * @type struct<TitleButton>[]
 * @desc コマンド識別子ごとに画像を指定します。画像未指定のボタンは自動生成の見た目になります。
 * @default ["{\"symbol\":\"newGame\",\"label\":\"\",\"image\":\"\",\"imageFocus\":\"\",\"imageDisabled\":\"\",\"x\":\"\",\"y\":\"\"}","{\"symbol\":\"continue\",\"label\":\"\",\"image\":\"\",\"imageFocus\":\"\",\"imageDisabled\":\"\",\"x\":\"\",\"y\":\"\"}","{\"symbol\":\"options\",\"label\":\"\",\"image\":\"\",\"imageFocus\":\"\",\"imageDisabled\":\"\",\"x\":\"\",\"y\":\"\"}"]
 *
 * @param titleButtonWidth
 * @text 【タイトル】生成ボタンの幅
 * @type number
 * @default 200
 *
 * @param titleButtonHeight
 * @text 【タイトル】生成ボタンの高さ
 * @type number
 * @default 44
 *
 * @param titleButtonSpacing
 * @text 【タイトル】ボタンの縦の間隔
 * @type number
 * @default 10
 *
 * @param titleButtonsY
 * @text 【タイトル】ボタン群の中心Y(下画面内)
 * @type number
 * @default 128
 *
 * @param titleButtonFontSize
 * @text 【タイトル】生成ボタンの文字サイズ
 * @type number
 * @default 22
 *
 * @param titleColorNormal1
 * @text 【タイトル】生成ボタン 通常色(上)
 * @type string
 * @default #5aa8f0
 *
 * @param titleColorNormal2
 * @text 【タイトル】生成ボタン 通常色(下)
 * @type string
 * @default #2a62c4
 *
 * @param titleColorFocus1
 * @text 【タイトル】生成ボタン フォーカス色(上)
 * @type string
 * @default #ffd45a
 *
 * @param titleColorFocus2
 * @text 【タイトル】生成ボタン フォーカス色(下)
 * @type string
 * @default #f0861c
 *
 * @param titleBgImage
 * @text 【タイトル】下画面の背景画像
 * @type file
 * @dir img/system
 * @desc 未指定なら、チェック柄が流れる背景になります。指定した画像も敷き詰めてスクロールできます。
 *
 * @param titleBgColor1
 * @text 【タイトル】チェック柄の色1
 * @type string
 * @default #24418f
 *
 * @param titleBgColor2
 * @text 【タイトル】チェック柄の色2
 * @type string
 * @default #3157b8
 *
 * @param titleBgCheckSize
 * @text 【タイトル】チェック柄のマス(px)
 * @type number
 * @min 4
 * @default 32
 *
 * @param titleBgScrollX
 * @text 【タイトル】背景の流れる速さX(px/フレーム)
 * @type number
 * @decimals 2
 * @min -20
 * @desc 正の値で右へ、負の値で左へ流れます。0で固定。画像を指定した場合も同じ値で流れます。
 * @default 0.5
 *
 * @param titleBgScrollY
 * @text 【タイトル】背景の流れる速さY(px/フレーム)
 * @type number
 * @decimals 2
 * @min -20
 * @desc 正の値で下へ、負の値で上へ流れます。
 * @default 0.5
 *
 * @param titleBgVignette
 * @text 【タイトル】背景の四隅を暗くする
 * @type boolean
 * @default true
 *
 * @param titleFxEnabled
 * @text 【タイトル演出】演出をまとめてON/OFF
 * @type boolean
 * @desc OFFにすると、下の個別設定にかかわらず演出が全て無効になります(画像の切り替えのみ)。
 * @default true
 *
 * @param titleFxAppear
 * @text 【タイトル演出】登場アニメ
 * @type boolean
 * @desc ボタンが順番に横から滑り込んで現れます。
 * @default true
 *
 * @param titleFxPop
 * @text 【タイトル演出】フォーカスで膨らむ
 * @type boolean
 * @default true
 *
 * @param titleFxGlow
 * @text 【タイトル演出】フォーカスで発光(脈打つ)
 * @type boolean
 * @default true
 *
 * @param titleFxShine
 * @text 【タイトル演出】光の帯が走る
 * @type boolean
 * @desc フォーカス時と、フォーカス中は一定間隔で、ボタンの形に沿って光が走ります。
 * @default true
 *
 * @param titleFxFloat
 * @text 【タイトル演出】フォーカス中ふわふわ上下
 * @type boolean
 * @default true
 *
 * @param titleFxPress
 * @text 【タイトル演出】押している間凹む
 * @type boolean
 * @default true
 *
 * @param titleFxRipple
 * @text 【タイトル演出】クリック位置から波紋
 * @type boolean
 * @default true
 *
 * @param titleFxDecide
 * @text 【タイトル演出】決定時のフラッシュと弾み
 * @type boolean
 * @default true
 *
 * @param titleFxSe
 * @text 【タイトル演出】マウスで選択したときのカーソルSE
 * @type boolean
 * @default true
 *
 * @param debugInput
 * @text 【デバッグ】入力情報を下画面に表示
 * @type boolean
 * @desc マウス・タッチの座標や判定の状態を、下画面の左下に重ねて表示します。不具合調査用です。
 * @default false
 *
 * @param wazaEnabled
 * @text 【わざ】わざボタン(左上)の機能を使う
 * @type boolean
 * @desc 戦闘中の左上ボタンで、キャラ選択 → タイミングゲージ → わざ発動を行います。
 * @default true
 *
 * @param wazaDefaultSkillId
 * @text 【わざ】既定のわざ(スキルID)
 * @type skill
 * @desc アクターのメモ欄に <わざ:スキルID> がないときに使うスキル。0なら、そのアクターが覚えている最初のスキル(通常攻撃・防御を除く)。
 * @default 0
 *
 * @param wazaMinStamina
 * @text 【わざ】わざを使うのに必要な最低スタミナ
 * @type number
 * @min 0
 * @desc わざは「今あるスタミナを全て消費」して撃ちます。この値未満のときは選べません(0なら、スタミナが0でも撃てます)。
 * @default 1
 *
 * @param wazaRiseSec
 * @text 【わざ】ゲージが頂点まで昇る時間(秒)
 * @type number
 * @decimals 2
 * @min 0.2
 * @desc 小さいほど速く、難しくなります。
 * @default 0.85
 *
 * @param wazaCycles
 * @text 【わざ】押さずに待てる往復回数
 * @type number
 * @min 1
 * @desc この回数だけ往復しても押さなかった場合は、最低倍率で自動発動します。
 * @default 3
 *
 * @param wazaMinRate
 * @text 【わざ】最低ダメージ倍率(ゲージ最下)
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @param wazaMaxRate
 * @text 【わざ】最高ダメージ倍率(頂点の少し手前)
 * @type number
 * @decimals 2
 * @default 1.5
 *
 * @param wazaPerfectRate
 * @text 【わざ】パーフェクト時のダメージ倍率
 * @type number
 * @decimals 2
 * @default 2.0
 *
 * @param wazaPerfectWidth
 * @text 【わざ】パーフェクトの幅(頂点からの割合)
 * @type number
 * @decimals 3
 * @min 0
 * @max 0.5
 * @default 0.06
 *
 * @param wazaCurve
 * @text 【わざ】倍率の伸び方(1=直線 / 大きいほど頂点付近だけ高い)
 * @type number
 * @decimals 2
 * @min 0.2
 * @default 2.0
 *
 * @param wazaSeStop
 * @text 【わざ】中央ボタンを押した効果音
 * @type file
 * @dir audio/se/
 * @desc ホイール中央のボタンでゲージを止めた瞬間の音。空欄ならシステム効果音の「決定」を鳴らします。
 *
 * @param wazaSeStopVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param wazaSeStopPitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param wazaSeStopPan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param wazaSePerfect
 * @text 【わざ】パーフェクト時の追加効果音
 * @type file
 * @dir audio/se/
 * @desc パーフェクトのときだけ、上の音に重ねて鳴らす音。空欄ならシステム効果音の「装備」を鳴らします。
 *
 * @param wazaSePerfectVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param wazaSePerfectPitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param wazaSePerfectPan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param recruitEnabled
 * @text 【仲間化】敵を仲間にするシステムを使う
 * @type boolean
 * @desc 勝利後(リザルトのあと)、倒した敵が確率で起き上がり、仲間にするかを選べます。仲間にすると、新しいアクターが生成されます。
 * @default true
 *
 * @param recruitEnemies
 * @text 【仲間化】敵ごとの設定(複数)
 * @type struct<RecruitEnemy>[]
 * @desc 仲間にできる敵と、仲間にしたときに元になるアクター(テンプレート)・確率を指定します。敵のメモ欄 <仲間:アクターID> <仲間確率:数値> でも指定できます。
 * @default []
 *
 * @param recruitAllEnemies
 * @text 【仲間化】設定のない敵も仲間候補にする
 * @type boolean
 * @desc ONにすると、全ての敵が【共通のテンプレート】を元に仲間候補になります。OFFなら、上の設定やメモ欄のある敵だけです。
 * @default false
 *
 * @param recruitFallbackActor
 * @text 【仲間化】共通のテンプレートのアクター
 * @type actor
 * @desc 敵ごとのテンプレート指定がないときに使うアクター。
 * @default 1
 *
 * @param recruitDefaultRate
 * @text 【仲間化】共通の確率(%)
 * @type number
 * @min 0
 * @max 100
 * @desc 敵ごとの確率の指定がないときの、倒した敵が起き上がる確率。
 * @default 20
 *
 * @param recruitLevelMode
 * @text 【仲間化】仲間になったときのレベル
 * @type select
 * @option テンプレートの初期レベル
 * @value template
 * @option パーティの平均レベル
 * @value average
 * @option パーティの最高レベル
 * @value max
 * @default template
 *
 * @param recruitNumbering
 * @text 【仲間化】同じ名前の仲間に連番を付ける
 * @type boolean
 * @desc 同じ種類を複数仲間にしたとき、「スライム」「スライム2」「スライム3」のように区別します。
 * @default true
 *
 * @param recruitUseEnemyPortrait
 * @text 【仲間化】立ち絵HUDに敵の画像を使う
 * @type boolean
 * @desc テンプレートに立ち絵の指定がないとき、立ち絵HUDの立ち絵を倒した敵の戦闘画像にします。
 * @default true
 *
 * @param recruitMaxParty
 * @text 【仲間化】パーティの人数の上限
 * @type number
 * @min 0
 * @desc 0なら無制限。上限に達していると、仲間にできません。
 * @default 0
 *
 * @param recruitTextSpeed
 * @text 【仲間化】文字の表示速度(フレーム/文字)
 * @type number
 * @min 1
 * @default 2
 *
 * @param recruitMsgApproach
 * @text 【仲間化】近づいてきたときの文
 * @type string
 * @desc {name}は敵の名前に置き換わります。\n で改行。
 * @default 倒した{name}が\nちかづいてきた!
 *
 * @param recruitMsgJoin
 * @text 【仲間化】仲間になったときの文
 * @type string
 * @default {name}が\n仲間になった!
 *
 * @param recruitMsgLeave
 * @text 【仲間化】仲間にしなかったときの文
 * @type string
 * @default {name}は\n去っていった…
 *
 * @param recruitMsgFull
 * @text 【仲間化】人数の上限のときの文
 * @type string
 * @default これ以上\n仲間にできない…
 *
 * @param recruitAskLabel
 * @text 【仲間化】下画面の見出し
 * @type string
 * @default 仲間にする?
 *
 * @param recruitYesLabel
 * @text 【仲間化】「仲間にする」ボタンの文字
 * @type string
 * @default 仲間にする
 *
 * @param recruitNoLabel
 * @text 【仲間化】「仲間にしない」ボタンの文字
 * @type string
 * @default 仲間にしない
 *
 * @param recruitSeAppear
 * @text 【仲間化】起き上がったときの効果音
 * @type file
 * @dir audio/se/
 * @desc 空欄なら鳴らしません。
 *
 * @param recruitSeAppearVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param recruitSeAppearPitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param recruitSeAppearPan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param recruitSeJoin
 * @text 【仲間化】仲間になったときの効果音
 * @type file
 * @dir audio/se/
 * @desc 空欄ならシステム効果音の「回復」を鳴らします。
 *
 * @param recruitSeJoinVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param recruitSeJoinPitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param recruitSeJoinPan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param recruitMeJoin
 * @text 【仲間化】仲間になったときのME
 * @type file
 * @dir audio/me/
 * @desc 空欄なら鳴らしません。
 *
 * @param recruitMessageImage
 * @text 【仲間化画像】上画面のメッセージ枠
 * @type file
 * @dir img/system
 * @desc 380x48。文字は上に重ねて描きます。
 *
 * @param recruitCursorImage
 * @text 【仲間化画像】メッセージ送りの▽
 * @type file
 * @dir img/system
 * @desc 12x8程度。文字が出きったときに点滅して表示します。
 *
 * @param recruitInfoPanelImage
 * @text 【仲間化画像】下画面の情報パネル
 * @type file
 * @dir img/system
 * @desc 292x76。
 *
 * @param recruitYesImage
 * @text 【仲間化画像】「仲間にする」ボタン(通常)
 * @type file
 * @dir img/system
 * @desc 200x38。文字は上に重ねて描きます(消すには【仲間化】ボタンの文字を空に)。
 *
 * @param recruitYesFocusImage
 * @text 【仲間化画像】「仲間にする」ボタン(フォーカス時)
 * @type file
 * @dir img/system
 * @desc 200x38。
 *
 * @param recruitNoImage
 * @text 【仲間化画像】「仲間にしない」ボタン(通常)
 * @type file
 * @dir img/system
 * @desc 200x38。
 *
 * @param recruitNoFocusImage
 * @text 【仲間化画像】「仲間にしない」ボタン(フォーカス時)
 * @type file
 * @dir img/system
 * @desc 200x38。
 *
 * @param pictureEffects
 * @text 【ピクチャ効果】ボタンエフェクトの設定(複数)
 * @type struct<PictureEffect>[]
 * @desc ピクチャ番号の範囲ごとに、マウスを重ねる・押す・クリックしたときの演出(アウトライン・拡大・光 等)を設定します。下画面に出したピクチャ(既定51〜100)をボタンのように見せられます。
 * @default ["{\"startId\":\"51\",\"endId\":\"100\",\"hoverScale\":\"106\",\"pressScale\":\"94\",\"outline\":\"true\",\"outlineColor\":\"#ffffff\",\"outlineWidth\":\"2\",\"outlineAlways\":\"false\",\"glow\":\"false\",\"glowColor\":\"#ffe9a0\",\"shine\":\"false\",\"ripple\":\"true\",\"bob\":\"0\",\"pulse\":\"0\",\"hoverBrighten\":\"12\",\"pressDim\":\"25\",\"alphaHit\":\"true\",\"se\":\"true\",\"hoverSe\":\"\",\"clickSe\":\"\",\"seVolume\":\"90\"}"]
 *
 * @param stageEnabled
 * @text 【ステージ】ステージ制の戦闘を使う
 * @type boolean
 * @desc 1回の戦闘の中で、複数の敵グループと順に戦います。背景はそのままで、足音とともに次のステージへシームレスに進みます。
 * @default true
 *
 * @param stageFormat
 * @text 【ステージ】ステージ表示の文字
 * @type string
 * @desc {n}は現在、{total}は全体のステージ数。
 * @default STAGE {n}/{total}
 *
 * @param stageIntroFrames
 * @text 【ステージ】ステージ表示の長さ(フレーム)
 * @type number
 * @min 30
 * @default 90
 *
 * @param stageClearBanner
 * @text 【ステージ】ステージクリアの表示を出す
 * @type boolean
 * @default true
 *
 * @param stageClearText
 * @text 【ステージ】ステージクリアの文字
 * @type string
 * @default STAGE CLEAR!
 *
 * @param stageShowIndicator
 * @text 【ステージ】戦闘中、現在のステージを表示
 * @type boolean
 * @default true
 *
 * @param stageIndicatorX
 * @text 【ステージ】左上ステージ表示 X座標
 * @type number
 * @min -999
 * @desc 上画面の左端からの位置(px)。2なら従来と同じです。
 * @default 2
 *
 * @param stageIndicatorY
 * @text 【ステージ】左上ステージ表示 Y座標
 * @type number
 * @min -999
 * @desc 上画面の上端からの位置(px)。2なら従来と同じです。
 * @default 2
 *
 * @param stageHideEmerge
 * @text 【ステージ】「〜が現れた!」のメッセージを出さない
 * @type boolean
 * @desc ステージ制の戦闘では、ステージ表示がその代わりになります。
 * @default true
 *
 * @param stageStepCount
 * @text 【ステージ】足音の回数
 * @type number
 * @min 1
 * @default 4
 *
 * @param stageStepInterval
 * @text 【ステージ】足音の間隔(フレーム)
 * @type number
 * @min 4
 * @default 16
 *
 * @param stage3dEnabled
 * @text 【ステージ3D】奥へ進む疑似3D演出を使う
 * @type boolean
 * @desc ステージを勝ち抜いたあと、パズドラのように、床と左右の壁が手前へ流れて「奥へ進んでいく」演出を、歩いている間に表示します。OFFなら、背景を横へ流すだけです。
 * @default true
 *
 * @param stage3dSpeed
 * @text 【ステージ3D】進む速さ
 * @type number
 * @decimals 2
 * @min 0.1
 * @desc 1が標準。大きいほど速く進んで見えます。
 * @default 1
 *
 * @param stage3dHorizon
 * @text 【ステージ3D】地平線の高さ(上画面の上からpx)
 * @type number
 * @min 20
 * @max 220
 * @desc 奥の消失点の高さ。小さいほど床が広く、大きいほど天井が広く見えます。
 * @default 100
 *
 * @param stage3dBob
 * @text 【ステージ3D】歩く上下の揺れ(px)
 * @type number
 * @decimals 1
 * @min 0
 * @default 2
 *
 * @param stage3dFloorRepeat
 * @text 【ステージ3D】床の模様の繰り返しの長さ
 * @type number
 * @decimals 2
 * @min 0.1
 * @desc 床の画像が、奥行きの何ユニットで1回繰り返されるか。小さいほど細かい模様になります。
 * @default 1
 *
 * @param stage3dWallRepeat
 * @text 【ステージ3D】壁の模様の繰り返しの長さ
 * @type number
 * @decimals 2
 * @min 0.1
 * @default 1.5
 *
 * @param stage3dFogColor
 * @text 【ステージ3D】奥の霧の色
 * @type string
 * @desc 奥にいくほどこの色に溶け込みます。
 * @default #0b0d11
 *
 * @param stage3dFogStrength
 * @text 【ステージ3D】霧の濃さ(0〜1)
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.9
 *
 * @param stage3dFadeFrames
 * @text 【ステージ3D】出入りのフェード(フレーム)
 * @type number
 * @min 1
 * @default 12
 *
 * @param stage3dResolution
 * @text 【ステージ3D】描画の粗さ(1=細かい / 2=標準 / 3,4=軽い)
 * @type number
 * @min 1
 * @max 4
 * @desc 数字を大きくすると、荒い(ドット絵のような)見た目になる代わりに、軽く動きます。
 * @default 2
 *
 * @param stage3dFloorImage
 * @text 【ステージ3D画像】床の画像
 * @type file
 * @dir img/system
 * @desc 真上から見た、繰り返し並べられる床の模様(128x128程度が目安)。未指定なら、自動で描いた床です。
 *
 * @param stage3dWallLeftImage
 * @text 【ステージ3D画像】左の壁の画像
 * @type file
 * @dir img/system
 * @desc 通路の進行方向に沿って繰り返される、壁の模様(横=進行方向、縦=壁の高さ。128x128程度)。未指定なら、自動で描いた壁です。
 *
 * @param stage3dWallRightImage
 * @text 【ステージ3D画像】右の壁の画像
 * @type file
 * @dir img/system
 * @desc 未指定なら、左の壁と同じ画像を使います。
 *
 * @param stage3dCeilingImage
 * @text 【ステージ3D画像】天井の画像
 * @type file
 * @dir img/system
 * @desc 未指定なら、自動で描いた暗い天井です。
 *
 * @param stage3dBackImage
 * @text 【ステージ3D画像】遠景の画像
 * @type file
 * @dir img/system
 * @desc 通路の突き当たり(奥)に見える背景。上画面全体に引き伸ばして敷きます。未指定なら、霧の色のグラデーションです。
 *
 * @param stageScrollSpeed
 * @text 【ステージ】歩く間の背景の流れる速さ(px/フレーム)
 * @type number
 * @decimals 1
 * @min 0
 * @desc 歩いている間、戦闘背景を横へ流します。0で固定。
 * @default 3
 *
 * @param stageSynth
 * @text 【ステージ】効果音が未指定のとき、足音とジングルを自動生成
 * @type boolean
 * @desc ONなら、音のファイルを指定しなくても、簡易的な足音とジングルが鳴ります。
 * @default true
 *
 * @param stageJingleMe
 * @text 【ステージ】開始のジングル(ME)
 * @type file
 * @dir audio/me/
 * @desc 指定すると、BGMが一時的に止まって鳴ります。空欄なら下の効果音、それも空なら自動生成のジングル。
 *
 * @param stageJingleSe
 * @text 【ステージ】開始のジングル(効果音)
 * @type file
 * @dir audio/se/
 * @desc MEを使わない場合の、短いジングル。
 *
 * @param stageJingleSeVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param stageJingleSePitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param stageJingleSePan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param stageStepSe
 * @text 【ステージ】足音の効果音
 * @type file
 * @dir audio/se/
 * @desc 1歩ごとに鳴らします。空欄なら自動生成の足音。
 *
 * @param stageStepSeVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param stageStepSePitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param stageStepSePan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param stageBannerImage
 * @text 【ステージ画像】ステージ表示の帯
 * @type file
 * @dir img/system
 * @desc 400x76。文字は上に重ねて描きます。
 *
 * @param stageIndicatorImage
 * @text 【ステージ画像】左上のステージ表示の枠
 * @type file
 * @dir img/system
 * @desc 112x22。
 *
 * @param uiTextStyles
 * @text 【UI文字】文字のフォント・色(複数)
 * @type struct<UiTextStyle>[]
 * @desc UI文字設定。対象・フォント・文字色・縁取り色・文字サイズ倍率を構造体で指定します。
 * @default []
 *
 * @param enemyHpEnabled
 * @text 【敵HP】敵にHPゲージを表示
 * @type boolean
 * @default true
 *
 * @param enemyHpMode
 * @text 【敵HP】表示するタイミング
 * @type select
 * @option 常に表示
 * @value always
 * @option ダメージを受けたら表示
 * @value damaged
 * @default always
 *
 * @param enemyHpPosition
 * @text 【敵HP】ゲージの位置
 * @type select
 * @option 敵の足元の下
 * @value below
 * @option 敵の頭の上
 * @value above
 * @default below
 *
 * @param enemyHpWidth
 * @text 【敵HP】ゲージの幅(px)
 * @type number
 * @min 8
 * @default 44
 *
 * @param enemyHpHeight
 * @text 【敵HP】ゲージの高さ(px)
 * @type number
 * @min 2
 * @default 5
 *
 * @param enemyHpOffsetY
 * @text 【敵HP】敵からの距離(px)
 * @type number
 * @min -999
 * @default 4
 *
 * @param enemyHpFixedToHud
 * @text 【敵HP】立ち絵HUDの上に固定
 * @type boolean
 * @desc ONなら敵HPバーのY座標を立ち絵HUDの上端を基準に固定します。
 * @default true
 *
 * @param enemyHpHudOffsetY
 * @text 【敵HP】HUD上端からのYずらし
 * @type number
 * @min -999
 * @default -6
 * @desc 立ち絵HUDの上端からの位置。-6ならHUDより6px上です。
 *
 * @param enemyBaseFromHpY
 * @text 【敵】HPバー基準からの足元Y
 * @type number
 * @min -999
 * @default -8
 * @desc 敵の足元をHPバー基準から何pxずらすか。負数ならHPバーより上に立ちます。
 *
 * @param enemyHpShowName
 * @text 【敵HP】敵の名前を表示
 * @type boolean
 * @default false
 *
 * @param enemyHpBackImage
 * @text 【敵HP画像】ゲージの背景
 * @type file
 * @dir img/system
 * @desc ゲージの幅x高さ(既定44x5)に引き伸ばして表示します。
 *
 * @param enemyHpFillImage
 * @text 【敵HP画像】ゲージの中身
 * @type file
 * @dir img/system
 * @desc HPの割合に応じて左から切り取って表示します。
 *
 * @param enemyHpFrameImage
 * @text 【敵HP画像】ゲージの枠
 * @type file
 * @dir img/system
 * @desc ゲージの上に重ねます。
 *
 * @param enemySizes
 * @text 【敵サイズ】敵ごとの大きさ・位置の調整(複数)
 * @type struct<EnemySize>[]
 * @desc 敵ごとに、大きさ(全体の拡大率に掛け算)と位置のずらしを指定します。敵のメモ欄 <敵サイズ:%> <敵X:px> <敵Y:px> でも指定できます。
 * @default []
 *
 * @param stageRevealGap
 * @text 【ステージ】敵が左から順に現れる間隔(フレーム)
 * @type number
 * @min 0
 * @default 10
 *
 * @param stageStepFadeFrames
 * @text 【ステージ】歩き終わりに足音をフェードアウトする時間(フレーム)
 * @type number
 * @min 0
 * @desc 足音の効果音が長い場合でも、歩き終わるとここで切れます。
 * @default 8
 *
 * @param stageCutinImages
 * @text 【ステージ画像】ステージ表示に重ねる画像(複数)
 * @type struct<BattleImage>[]
 * @desc 「STAGE n/N」の表示と一緒に出す画像(上画面)。位置・拡大・出現・動きを指定できます。表示が終わると消えます。
 * @default []
 *
 * @param stageClearImages
 * @text 【ステージ画像】ステージクリア表示に重ねる画像(複数)
 * @type struct<BattleImage>[]
 * @default []
 *
 * @param stageClearImage
 * @text 【ステージ画像】ステージクリアの帯
 * @type file
 * @dir img/system
 * @desc 400x76。文字は上に重ねて描きます。
 *
 * @param uiTheme
 * @text 【UI全体】デザインテーマ
 * @type select
 * @option ソリッド(女神転生IV風: 面取りの角・暗い面・アクセント線)
 * @value solid
 * @option ポップ(従来: 丸み・グラデーション・光沢)
 * @value pop
 * @desc UI全体の自動生成の見た目を切り替えます。画像を指定した部品は、テーマにかかわらず画像のままです。
 * @default solid
 *
 * @param uiAccent
 * @text 【UI全体】アクセント色(ソリッド時)
 * @type string
 * @desc 枠線・強調・フォーカスの色。女神転生IVの橙が既定です。
 * @default #f08a24
 *
 * @param uiAccentHot
 * @text 【UI全体】強調の赤(ソリッド時)
 * @type string
 * @default #ff4a2a
 *
 * @param uiBase
 * @text 【UI全体】パネルの暗い色(ソリッド時)
 * @type string
 * @default #0d0f13
 *
 * @param uiBase2
 * @text 【UI全体】パネルの明るい色(ソリッド時)
 * @type string
 * @default #1b1f27
 *
 * @param skillBannerEnabled
 * @text 【技名表示】使った技名を戦闘中に表示
 * @type boolean
 * @desc 行動の開始時に、行動者の頭上(味方=立ち絵の上 / 敵=敵の上)へ、アイコンつきの帯で技名を表示します。
 * @default true
 *
 * @param skillBannerShowAttack
 * @text 【技名表示】通常攻撃・防御も表示
 * @type boolean
 * @default false
 *
 * @param skillBannerShowItems
 * @text 【技名表示】アイテム使用も表示
 * @type boolean
 * @default false
 *
 * @param skillBannerSkills
 * @text 【技名表示】技ごとの設定(アイコン・背景・色 等)
 * @type struct<SkillBanner>[]
 * @desc 技(スキル)ごとに、表示名・アイコン画像・アイコン番号・背景画像・色を指定します。未指定の技は、スキルのアイコンと共通の背景で表示します。
 * @default []
 *
 * @param skillBannerBgImage
 * @text 【技名表示】共通の背景画像
 * @type file
 * @dir img/system
 * @desc 帯の背景画像。文字の長さに合わせて横に伸びます(両端は固定幅の端として切り出し)。未指定なら、自動で描いた帯です。
 *
 * @param skillBannerCap
 * @text 【技名表示】背景画像の両端の幅(px)
 * @type number
 * @min 0
 * @desc 背景画像の左右この幅は引き伸ばさず、中央だけを伸縮します(角が歪みません)。0なら全体を引き伸ばします。
 * @default 12
 *
 * @param skillBannerIconPlateImage
 * @text 【技名表示】アイコンの台座の画像
 * @type file
 * @dir img/system
 * @desc アイコンの下に敷く画像(正方形。帯の高さ-6px程度)。未指定なら、自動の台座です。
 *
 * @param skillBannerColor1
 * @text 【技名表示】自動の帯の色(上)
 * @type string
 * @default #f4a638
 *
 * @param skillBannerColor2
 * @text 【技名表示】自動の帯の色(下)
 * @type string
 * @default #c35a0c
 *
 * @param skillBannerHeight
 * @text 【技名表示】帯の高さ(px)
 * @type number
 * @min 16
 * @default 28
 *
 * @param skillBannerMinWidth
 * @text 【技名表示】帯の最小の幅(px)
 * @type number
 * @min 40
 * @default 120
 *
 * @param skillBannerFontSize
 * @text 【技名表示】文字サイズ
 * @type number
 * @min 8
 * @default 15
 *
 * @param skillBannerFrames
 * @text 【技名表示】表示している時間(フレーム)
 * @type number
 * @min 20
 * @default 60
 *
 * @param skillBannerOffsetY
 * @text 【技名表示】位置のずらしY
 * @type number
 * @min -999
 * @desc 行動者の頭上からの上下のずらし。マイナスで上へ。
 * @default 0
 *
 * @param battleImages
 * @text 【戦闘】上画面に重ねる画像(複数)
 * @type struct<BattleImage>[]
 * @desc 戦闘中の上画面に、好きな枚数の画像を重ねます。位置・原点・拡大率・不透明度・合成方法・奥/手前・出現・常時の動き・敷き詰めスクロールを指定できます。
 * @default []
 *
 * @param hudEnabled
 * @text 【立ち絵HUD】SVキャラの代わりに立ち絵+HP+スタミナを表示
 * @type boolean
 * @desc ONにすると、戦闘中のSVキャラ(上画面の弧状の配置)を隠し、上画面の下に前衛3人の立ち絵・名前・HP・スタミナを表示します。行動時に前へ出る動きもなくなります。
 * @default true
 *
 * @param hudActors
 * @text 【立ち絵HUD】アクターごとの立ち絵(複数)
 * @type struct<HudActor>[]
 * @desc アクターごとに、状態別の立ち絵(img/pictures)を指定します。未指定のアクターは、顔グラフィックを表示します。メモ欄の <立ち絵:ファイル名> でも通常の立ち絵を指定できます。
 * @default []
 *
 * @param hudPortraitHeight
 * @text 【立ち絵HUD】立ち絵の高さ(px)
 * @type number
 * @min 8
 * @desc 立ち絵をこの高さに合わせて縮小して表示します(縦横比は保ちます)。アクターごとの拡大率は構造体で調整できます。
 * @default 92
 *
 * @param hudOffsetX
 * @text 【立ち絵HUD】全体のずらしX
 * @type number
 * @min -999
 * @default 0
 *
 * @param hudOffsetY
 * @text 【立ち絵HUD】全体のずらしY
 * @type number
 * @min -999
 * @default 0
 *
 * @param hudSpacing
 * @text 【立ち絵HUD】カード同士の間隔(px)
 * @type number
 * @min 0
 * @default 6
 *
 * @param hudShowNumbers
 * @text 【立ち絵HUD】HPの数値を表示
 * @type boolean
 * @default true
 *
 * @param hudFx
 * @text 【立ち絵HUD】演出(行動で浮く・被弾で揺れる 等)
 * @type boolean
 * @desc 行動中のカードが浮いて光り、被弾すると揺れて赤く光ります。HPゲージは遅れて減る赤いゲージが付きます。
 * @default true
 *
 * @param hudCardBgEnabled
 * @text 【立ち絵HUD】カードの背景を描く
 * @type boolean
 * @desc ONにすると、カードの後ろに半透明の背景を描きます。背景画像を指定した場合は画像が優先されます。
 * @default false
 *
 * @param hudCardImage
 * @text 【立ち絵HUD画像】カード背景
 * @type file
 * @dir img/system
 * @desc 120x100。カード全体の背景です。
 *
 * @param hudNamePlateImage
 * @text 【立ち絵HUD画像】名前プレート
 * @type file
 * @dir img/system
 * @desc 74x14。名前の文字は上に重ねて描きます。
 *
 * @param hudHpBackImage
 * @text 【立ち絵HUD画像】HPゲージの背景
 * @type file
 * @dir img/system
 * @desc 62x8。
 *
 * @param hudHpFillImage
 * @text 【立ち絵HUD画像】HPゲージの中身
 * @type file
 * @dir img/system
 * @desc 62x8。HPの割合に応じて左から切り取って表示します。
 *
 * @param hudHpFrameImage
 * @text 【立ち絵HUD画像】HPゲージの枠
 * @type file
 * @dir img/system
 * @desc 62x8。ゲージの上に重ねます。
 *
 * @param hudStBackImage
 * @text 【立ち絵HUD画像】スタミナゲージの背景
 * @type file
 * @dir img/system
 * @desc 54x6。
 *
 * @param hudStFillImage
 * @text 【立ち絵HUD画像】スタミナゲージの中身
 * @type file
 * @dir img/system
 * @desc 54x6。割合に応じて左から切り取って表示します。
 *
 * @param hudStFrameImage
 * @text 【立ち絵HUD画像】スタミナゲージの枠
 * @type file
 * @dir img/system
 * @desc 54x6。ゲージの上に重ねます。
 *
 * @param hudHpIconImage
 * @text 【立ち絵HUD画像】HPのアイコン
 * @type file
 * @dir img/system
 * @desc 10x10(ハート等)。
 *
 * @param hudStIconImage
 * @text 【立ち絵HUD画像】スタミナのアイコン
 * @type file
 * @dir img/system
 * @desc 10x10(歯車等)。
 *
 * @param hudEmblemImage
 * @text 【立ち絵HUD画像】立ち絵の足元のエンブレム
 * @type file
 * @dir img/system
 * @desc 18x18。立ち絵の左下に重ねます。
 *
 * @param hudPortraitFrameImage
 * @text 【立ち絵HUD画像】立ち絵の枠(顔グラ表示時)
 * @type file
 * @dir img/system
 * @desc 64x64。立ち絵を指定していないアクターの顔グラの枠です。
 *
 * @param hudFocusImage
 * @text 【立ち絵HUD画像】行動中の光
 * @type file
 * @dir img/system
 * @desc 120x100。行動中のカードの上に加算合成で重ねます。未指定なら自動の光です。
 *
 * @param resultEnabled
 * @text 【リザルト】戦闘後リザルト画面を使う
 * @type boolean
 * @desc 勝利時に、標準のメッセージ表示の代わりに、2画面のリザルト画面を表示します。
 * @default true
 *
 * @param resultTitleText
 * @text 【リザルト】上画面の見出し
 * @type string
 * @default VICTORY!
 *
 * @param resultTopImage
 * @text 【リザルト】上画面の背景画像
 * @type file
 * @dir img/system
 * @desc 上画面(400x240)全体に敷く画像。未指定なら背景色のグラデーションです。
 *
 * @param resultTopBackColor
 * @text 【リザルト】上画面の背景色
 * @type string
 * @default #0b1d3f
 *
 * @param resultBottomImage
 * @text 【リザルト】下画面の背景画像
 * @type file
 * @dir img/system
 * @desc 下画面(320x240)全体に敷く画像。未指定なら背景色のグラデーションです。
 *
 * @param resultBottomBackColor
 * @text 【リザルト】下画面の背景色
 * @type string
 * @default #0b1d3f
 *
 * @param resultBgChecker
 * @text 【リザルト】背景にチェック柄が流れる
 * @type boolean
 * @desc 背景の上に、うっすらチェック柄を斜めに流します。
 * @default true
 *
 * @param resultTopImages
 * @text 【リザルト】上画面に重ねる画像(複数)
 * @type struct<ResultImage>[]
 * @desc 好きな枚数の画像を、位置・大きさ・出現・動きを指定して上画面に重ねます。上のものほど奥です。
 * @default []
 *
 * @param resultBottomImages
 * @text 【リザルト】下画面に重ねる画像(複数)
 * @type struct<ResultImage>[]
 * @desc 好きな枚数の画像を、位置・大きさ・出現・動きを指定して下画面に重ねます。
 * @default []
 *
 * @param resultCardBgEnabled
 * @text 【リザルト】カードの背景を描く
 * @type boolean
 * @desc OFFにすると、カード(顔・名前・ゲージ)の背景パネルを描きません。背景画像を指定した場合は、画像が優先されます。
 * @default true
 *
 * @param resultPanelBgEnabled
 * @text 【リザルト】下画面パネルの背景を描く
 * @type boolean
 * @desc OFFにすると、下画面の経験値・ゴールド・アイテムのパネル背景を描きません。パネル画像を指定した場合は、画像が優先されます。
 * @default true
 *
 * @param resultBannerImage
 * @text 【リザルト画像】上画面の見出し帯
 * @type file
 * @dir img/system
 * @desc 400x40で作ると、そのまま収まります(伸縮して表示)。文字は上に重ねて描きます。文字を消すには【リザルト】上画面の見出しを空にしてください。
 *
 * @param resultCardImage
 * @text 【リザルト画像】カード背景(前衛)
 * @type file
 * @dir img/system
 * @desc 125x92で作ると、そのまま収まります。後衛用を指定しなければ、後衛もこの画像を使います。
 *
 * @param resultCardImageBack
 * @text 【リザルト画像】カード背景(後衛)
 * @type file
 * @dir img/system
 * @desc 125x92。未指定なら前衛用の画像を使います。
 *
 * @param resultCardEmptyImage
 * @text 【リザルト画像】カード背景(空き枠)
 * @type file
 * @dir img/system
 * @desc 125x92。仲間が6人未満のときの空き枠の画像です。
 *
 * @param resultFaceFrameImage
 * @text 【リザルト画像】顔グラの枠
 * @type file
 * @dir img/system
 * @desc 50x50。顔グラフィックの上に重ねます(中央は透明に)。
 *
 * @param resultChipFrontImage
 * @text 【リザルト画像】前衛のチップ
 * @type file
 * @dir img/system
 * @desc 20x12。指定すると「前」の文字は描きません。
 *
 * @param resultChipBackImage
 * @text 【リザルト画像】後衛のチップ
 * @type file
 * @dir img/system
 * @desc 20x12。指定すると「後」の文字は描きません。
 *
 * @param resultGaugeBackImage
 * @text 【リザルト画像】経験値ゲージの背景
 * @type file
 * @dir img/system
 * @desc 111x12。
 *
 * @param resultGaugeFillImage
 * @text 【リザルト画像】経験値ゲージの中身
 * @type file
 * @dir img/system
 * @desc 111x12。経験値の割合に応じて左から切り取って表示します。
 *
 * @param resultGaugeFrameImage
 * @text 【リザルト画像】経験値ゲージの枠
 * @type file
 * @dir img/system
 * @desc 111x12。ゲージの上に重ねます。
 *
 * @param resultLevelUpImage
 * @text 【リザルト画像】LEVEL UP!のリボン
 * @type file
 * @dir img/system
 * @desc 54x14。文字は上に重ねて描きます(消すには【リザルト】レベルアップ表示文字を空に)。
 *
 * @param resultSparkImage
 * @text 【リザルト画像】レベルアップの粒
 * @type file
 * @dir img/system
 * @desc 小さな正方形の画像(8〜16px)。星の代わりに弾けます。
 *
 * @param resultGetImage
 * @text 【リザルト画像】下画面の見出し(GET!)
 * @type file
 * @dir img/system
 * @desc 190x28。文字は上に重ねて描きます(消すには【リザルト】下画面の見出しを空に)。
 *
 * @param resultExpPanelImage
 * @text 【リザルト画像】経験値パネル
 * @type file
 * @dir img/system
 * @desc 292x38。
 *
 * @param resultGoldPanelImage
 * @text 【リザルト画像】ゴールドパネル
 * @type file
 * @dir img/system
 * @desc 292x38。
 *
 * @param resultItemPanelImage
 * @text 【リザルト画像】アイテムパネル
 * @type file
 * @dir img/system
 * @desc 292x62。
 *
 * @param resultExpIconImage
 * @text 【リザルト画像】経験値のアイコン
 * @type file
 * @dir img/system
 * @desc 24x24。
 *
 * @param resultGoldIconImage
 * @text 【リザルト画像】ゴールドのアイコン
 * @type file
 * @dir img/system
 * @desc 24x24。
 *
 * @param resultNextImage
 * @text 【リザルト画像】「つぎへ」ボタン(通常)
 * @type file
 * @dir img/system
 * @desc 150x28。文字は上に重ねて描きます(消すには【リザルト】「次へ」ボタンの文字を空に)。
 *
 * @param resultNextFocusImage
 * @text 【リザルト画像】「つぎへ」ボタン(フォーカス時)
 * @type file
 * @dir img/system
 * @desc 150x28。未指定なら通常の画像に演出だけを付けます。
 *
 * @param resultNextPressImage
 * @text 【リザルト画像】「つぎへ」ボタン(押下時)
 * @type file
 * @dir img/system
 * @desc 150x28。未指定なら通常の画像に演出だけを付けます。
 *
 * @param resultDimColor
 * @text 【リザルト】全体の暗転色
 * @type string
 * @desc リザルトが現れる間、戦闘画面の上に重ねる色(rgba形式)。
 * @default rgba(0,0,0,0.35)
 *
 * @param resultGaugeFrames
 * @text 【リザルト】ゲージ演出の長さ(フレーム)
 * @type number
 * @min 1
 * @default 70
 *
 * @param resultGaugeColor1
 * @text 【リザルト】ゲージ色(明)
 * @type string
 * @default #58d0ff
 *
 * @param resultGaugeColor2
 * @text 【リザルト】ゲージ色(暗)
 * @type string
 * @default #1c6fb4
 *
 * @param resultGaugeBackColor
 * @text 【リザルト】ゲージの背景色
 * @type string
 * @default rgba(0,0,0,0.55)
 *
 * @param resultLevelUpText
 * @text 【リザルト】レベルアップ表示文字
 * @type string
 * @default LEVEL UP!
 *
 * @param resultLevelUpSe
 * @text 【リザルト】レベルアップ効果音
 * @type file
 * @dir audio/se/
 * @desc 空欄ならシステム効果音の「回復」を鳴らします。
 *
 * @param resultLevelUpSeVolume
 * @text 　└ 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param resultLevelUpSePitch
 * @text 　└ ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param resultLevelUpSePan
 * @text 　└ 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param resultGetLabel
 * @text 【リザルト】下画面の見出し
 * @type string
 * @default GET!
 *
 * @param resultExpLabel
 * @text 【リザルト】「経験値」表記
 * @type string
 * @default EXP
 *
 * @param resultGoldLabel
 * @text 【リザルト】「ゴールド」表記
 * @type string
 * @default GOLD
 *
 * @param resultItemLabel
 * @text 【リザルト】「アイテム」表記
 * @type string
 * @default ITEM
 *
 * @param resultNoItemText
 * @text 【リザルト】アイテムなしの表記
 * @type string
 * @default - なし -
 *
 * @param resultContinueHint
 * @text 【リザルト】「次へ」ボタンの文字
 * @type string
 * @default つぎへ
 *
 * @param resultMinWait
 * @text 【リザルト】入力を受け付けるまでの最短フレーム
 * @type number
 * @min 0
 * @desc 誤操作防止。この間は、クリック等でスキップ/終了できません。
 * @default 20
 *
 * @param staminaInitialValue
 * @text 【スタミナ】戦闘開始時の初期値
 * @type number
 * @min -1
 * @desc -1なら最大値からスタート。アクターのメモ欄 <スタミナ初期値:50>(または <StaminaInitial:50>)で個別に上書きできます。
 * @default -1
 *
 * @command setPictureEffect
 * @text ピクチャのボタンエフェクト切替
 * @desc ピクチャ番号の範囲で、ボタンエフェクトを一時的に無効/有効にします(状態はセーブされます)。
 *
 * @arg startId
 * @text 開始番号
 * @type number
 * @min 1
 * @default 51
 *
 * @arg endId
 * @text 終了番号(0なら開始番号のみ)
 * @type number
 * @min 0
 * @default 0
 *
 * @arg enabled
 * @text エフェクト
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @command setStages
 * @text 次の戦闘のステージを設定
 * @desc 次に始まる戦闘を、複数のステージにします。戦闘の処理で指定した敵グループが1ステージ目で、ここで指定したグループが2ステージ目以降に順に登場します。
 *
 * @arg troops
 * @text 2ステージ目以降の敵グループID(カンマ区切り)
 * @type string
 * @default 2,3
 *
 * @command setScreenVisible
 * @text 画面の表示切替
 * @desc 現在のシーンの上/下画面のUI(上は画面描画も)の表示を切り替えます。
 *
 * @arg screen
 * @text 対象
 * @type select
 * @option 上画面
 * @value top
 * @option 下画面
 * @value bottom
 * @default bottom
 *
 * @arg visible
 * @text 表示
 * @type boolean
 * @default true
 *
 * @help
 * ■ 画面仕様(3DS実機と同一)
 *   上画面 : 400x240 (5:3)
 *   下画面 : 320x240 (4:3)  ※上画面の中央下(x=40)に配置
 *   実キャンバスは 400x(480+間隔) になります。
 *   表示倍率(既定1.5)で、ウィンドウは 600x720 で表示されます。
 *   倍率は表示だけの拡大で、内部座標・レイアウトは変わりません。
 *
 * ■ 独立の考え方
 *   ・Graphics.width / height / boxWidth / boxHeight は「上画面」を指します。
 *     そのためマップ・戦闘の描画やスクロール計算は上画面基準で動作します。
 *   ・シーンごとに WindowLayer を上下で別々に持ち、座標は各画面の左上が原点です。
 *   ・下画面UIのシーンでは、ウィンドウ用の boxWidth/boxHeight が
 *     自動で下画面サイズ(320x240-余白)になり、標準レイアウトが下画面に収まります。
 *     (Spriteset生成中だけは上画面基準に戻します)
 *   ・タッチは画面ごとに判定され、上画面のウィンドウが下画面のタッチに
 *     反応することはありません。
 *
 * ■ スクリプトAPI
 *   window.setUiScreen("top" | "bottom")   ウィンドウの表示先を変更
 *   window.uiScreen()                       現在の表示先
 *   SceneManager._scene.setScreenVisible("top"|"bottom", true|false)
 *   SceneManager._scene.screenLayer("top"|"bottom")  各画面のWindowLayer
 *   Graphics.screenRect("top"|"bottom")     各画面の実キャンバス上の矩形
 *   Graphics.uiBox("top"|"bottom")          各画面のUIレイアウト用サイズ {width,height}
 *   Graphics.physicalWidth / physicalHeight 実キャンバスのサイズ
 *   TouchInput.screen()                     タッチ位置の画面 "top"|"bottom"|null
 *   TouchInput.localPosition("top"|"bottom") その画面内のローカル座標(Point)
 *
 * ■ バトルホイール(YW_BattleWheel 統合)
 *   ・旧 YW_BattleWheel.js は無効(削除)にしてください。このプラグインに統合済みです。
 *   ・ホイールは下画面、前衛アクターと敵は上画面に表示されます。
 *   ・ホイール系パラメータの座標は「下画面の左上が原点」(既定は320x240に合わせ済み)。
 *   ・戦闘シーン(Scene_Battle)は下画面UIシーンに含めておいてください。
 *   ・敵はトループ座標(816x624基準)を上画面に縮小して配置します(【敵】パラメータ)。
 *   ・ホイールはスワイプ/ドラッグ、または PageUp / PageDown で回転します。
 *   ・アクター表示を「顔グラ扇形」にすると、顔グラを各区画(扇形)の形に切り抜いて敷き詰めます。
 *     区画と一緒にホイールが回転し、HPリングの内側・中央ハブの外側を埋めます。
 *   戦闘システム: タイムプログレス(アクティブ)、サイドビューON推奨。パーティ最大6人、前衛3人。
 *
 * ■ UIの文字(フォント・色)/ 敵のHPゲージ・サイズ
 *   ・【UI文字】文字のフォント・色(複数) で、対象(タイトル・四隅ボタン・わざ・リザルト・立ち絵HUD・
 *     技名の帯・ステージ表示・仲間化・敵HP)ごとに、フォントファイル(fontsフォルダ)・文字の色・
 *     縁取りの色・サイズ倍率を指定できます。「全部」を指定すると、個別の指定がない対象に適用されます。
 *     文字の色は、白い文字だけを指定色にします(赤・緑など強調のために色を変えている文字はそのまま)。
 *   ・敵にHPゲージを表示します(常に / ダメージを受けたら)。位置(足元の下 / 頭の上)・大きさ・名前の表示・
 *     ゲージの画像(背景・中身・枠)を変えられます。敵の拡大縮小の影響を受けない大きさで表示します。
 *   ・敵の大きさ: 全体の拡大率(【敵】の画像の拡大率)に加えて、【敵ごとの大きさ・位置の調整】または
 *     敵のメモ欄 <敵サイズ:80>(%)<敵X:10><敵Y:-5> で、敵ごとに調整できます。
 *
 * ■ ステージの疑似3D前進演出(パズドラのように奥へ進む)
 *   ・ステージを勝ち抜くと、上画面が「通路を奥へ進んでいく」映像になり、足音とともに次の敵のところへ着きます。
 *     床と左右の壁が手前へ流れ、奥は霧に溶け込みます。画像を3Dモデルで描くのではなく、
 *     床・壁の画像を、奥行きに合わせて縮めながら並べるプログラムの疑似3Dです。
 *   ・設定できる画像(img/system): 床 / 左の壁 / 右の壁 / 天井 / 遠景(通路の突き当たり)。
 *       床: 真上から見た模様。奥行き方向に繰り返されます。
 *       壁: 横が進行方向、縦が壁の高さ。進行方向に繰り返されます。
 *     未指定の画像は、テーマの色に合わせて自動で描きます(画像なしでも動きます)。
 *   ・進む速さ・地平線の高さ・歩く揺れ・模様の繰り返しの長さ・霧の色と濃さ・描画の粗さ(軽さ)を調整できます。
 *   ・演出中は、味方が歩く動き、足音、霧を組み合わせます。終わると元の戦闘背景に戻り、
 *     「STAGE n/N」の表示のあと、敵が左から順に現れます。
 *
 * ■ ステージ制の戦闘(1回の戦闘で複数のステージ)
 *   ・戦闘開始時に「STAGE 1/5」の表示とジングルが出てから、そのまま戦闘に入ります。
 *   ・ステージを勝ち抜くと、足音を鳴らし、味方が歩く動きと背景の横スクロールで歩いている間に、
 *     次の敵グループが現れ(戦闘背景はそのまま)、「STAGE 2/5」の表示のあと、シームレスに次の戦闘へ移ります。
 *   ・最後のステージに勝ったときに、全ステージ分の経験値・ゴールド・ドロップをまとめてリザルトに出します。
 *     敵を仲間にする機能の抽選も、全ステージ分の倒した敵を対象に行い、リザルトのあとで順に演出します。
 *   ・ステージの作り方(どちらか):
 *       敵グループ(トループ)のメモ欄に <ステージ:2,3,4> と書く
 *         → その敵グループが1ステージ目、2,3,4番の敵グループが2〜4ステージ目になります。
 *       プラグインコマンド「次の戦闘のステージを設定」で、戦闘の処理の直前に指定する
 *   ・全滅は通常どおり敗北、逃走は通常どおり戦闘終了です(ステージの進行はその戦闘で終わります)。
 *   ・ステージ表示の文字・長さ、足音の回数・間隔、ジングル(ME/効果音)、足音の効果音、
 *     帯と左上の表示枠の画像は、パラメータで変更できます。音を指定しない場合は、簡易的な足音とジングルを自動で鳴らします。
 *   ・ステージ表示(カットイン)の間、敵は表示されません。表示が終わると、敵が左から順にフェードで現れます。
 *   ・足音の効果音は、歩き終わるとそこで切れます(長い音源でも、戦闘中には残りません)。
 *   ・ステージ表示・ステージクリア表示・左上の枠は、画像に差し替えできます(画像のほか、好きな枚数の画像を重ねられます)。
 *   ・次のステージの敵は「敵グループ」として普通に作ってください(バトルイベントも動きます)。
 *
 * ■ ピクチャのボタンエフェクト(アウトライン・拡大・光 など)
 *   ・イベントコマンドで出したピクチャ(特に下画面のピクチャ。既定は51〜100番)に、
 *     ボタンのような演出を付けられます。PictureCallCommon(ピクチャのボタン化)と併用できます。
 *   ・【ピクチャ効果】ボタンエフェクトの設定(複数) に、ピクチャ番号の範囲ごとの設定を登録します
 *     (番号が重なる場合は、上にある設定が優先)。
 *   ・演出の種類:
 *       マウスを重ねる: 拡大 / アウトライン(輪郭線) / 発光 / 明るくする / 光の帯 / カーソルSE
 *       押している間: 凹む(縮小) / 暗くする
 *       クリック: 波紋(クリックした位置から、画像の形に沿って広がる) / 決定SE
 *       常時: ふわふわ上下 / 脈打つ拡大縮小
 *   ・アウトライン・発光・光の帯・波紋は、画像の不透明な部分の形に沿って描かれます。
 *   ・既定では、画像の透明な部分はマウスに反応しません(【透明な部分は反応させない】)。
 *   ・複数のピクチャが重なっているときは、一番手前(番号が大きい方)だけが反応します。
 *   ・プラグインコマンド「ピクチャのボタンエフェクト切替」で、番号の範囲ごとに一時的にOFFにできます。
 *
 * ■ 敵を仲間にする(戦闘後に確率で起き上がり、仲間にするか選べる)
 *   ・勝利して、リザルト(戦闘ログ)が閉じたあと、倒した敵が確率で「起き上がって」近づいてきます。
 *     上画面に敵の画像とメッセージ枠、下画面に「仲間にする / 仲間にしない」のボタンが出ます。
 *   ・仲間にすると、テンプレートのアクターを複製して【新しいアクター】を生成し、パーティに加えます。
 *     同じ種類の敵を何体仲間にしても、それぞれ別の個体(別のアクター: レベル・経験値・装備が独立)です。
 *     生成したアクターはセーブデータに保存され、ロード時に自動で復元されます。
 *   ・仲間にできる敵の指定:
 *       【敵ごとの設定】に、敵 / テンプレートのアクター / 確率 / 名前 を登録する
 *       または 敵のメモ欄に <仲間:アクターID> と書く(確率は <仲間確率:数値>、名前は <仲間名:名前>)
 *     ※テンプレートは、データベース上の普通のアクターです(顔グラ・歩行グラ・クラス・特徴を設定しておく)。
 *   ・立ち絵HUDを使っている場合、テンプレートに立ち絵の指定がなければ、倒した敵の戦闘画像が
 *     立ち絵になります(【立ち絵HUDに敵の画像を使う】)。テンプレートのアクターに設定した
 *     「アクターごとの立ち絵」も、生成したアクターに引き継がれます。
 *   ・文章・効果音・ME・ボタンの文字・メッセージ枠やボタンの画像は、パラメータで変更できます。
 *   ・操作: ボタンはマウス/タッチ、または 上下キー+決定キー。キャンセルキーは「仲間にしない」です。
 *     文字が出ている最中に決定/クリックで、全文を一気に表示します。
 *   ・設定が全く無い状態では、何も起きません(安全のため、仲間候補は明示した敵だけ)。
 *
 * ■ UIデザインテーマ(ソリッド / ポップ)
 *   ・【UI全体】デザインテーマ で、自動生成のUIの見た目をまとめて切り替えます。
 *     ソリッド(既定)は、女神転生IVを意識した「暗い面 + 面取りの角 + 橙のアクセント線」のデザインです。
 *     角は丸めず斜めに切り、グラデーションや光沢は抑え、強調(フォーカス)は橙の塗りつぶしで見せます。
 *     ポップは、これまでの丸みとグラデーション、光沢のデザインです。
 *   ・対象: タイトルのボタン・背景 / 戦闘の四隅ボタン・ホイール盤面・中央ハブ / わざ(選択・ゲージ・ハブ)/
 *     立ち絵HUD / 技名の帯 / リザルト(見出し・カード・ゲージ・パネル・ボタン・背景)。
 *   ・色は アクセント色・強調の赤・パネルの暗い/明るい色 で変えられます。
 *   ・個別の色のパラメータ(タイトルの背景色、リザルトの背景色・ゲージ色、技名の帯の色)は、
 *     従来の既定値のままなら、ソリッドでは自動でテーマの色に置き換わります。
 *     自分で色を変えている場合は、その色が優先されます。
 *   ・画像を指定した部品は、テーマにかかわらず画像のままです。
 *
 * ■ 技名表示(使った技の名前を、行動者の頭上に表示)
 *   ・行動が始まると、行動者の頭上に「アイコン + 技名」の帯が現れます。
 *     味方は立ち絵(カード)の上、敵は敵の上に出ます。ホイールで味方がスライドしても追従します。
 *   ・アイコンは、既定ではスキルに設定したアイコンです。【技ごとの設定】で、技ごとに
 *     アイコン画像 / アイコン番号 / 表示名 / 背景画像 / 帯の色を変えられます。
 *     スキルのメモ欄でも指定できます:
 *       <技名アイコン:画像名>   img/system の画像をアイコンにする
 *       <技名背景:画像名>       img/system の画像を、その技だけの背景にする
 *   ・背景は、【共通の背景画像】で画像に差し替えできます。画像は文字の長さに合わせて横に伸び、
 *     両端(既定12px)は歪まないよう固定されます。画像を指定しなければ、自動で描いた帯です。
 *   ・通常攻撃・防御・アイテムは、既定では表示しません(パラメータでON)。
 *   ・わざ(ホイール中央ボタンのゲージ)で撃った技名も表示されます。
 *
 * ■ 戦闘中に上画面へ重ねる画像(複数)
 *   ・【戦闘】上画面に重ねる画像(複数) に、好きな枚数の画像を登録できます。
 *     画像ごとに 位置(X/Y)・原点・拡大率・不透明度・合成方法(通常/加算/スクリーン/乗算)・
 *     重なり(奥=戦闘背景の上で敵味方の後ろ / 手前=敵味方や立ち絵HUDの前)・
 *     出現の仕方・常時の動き・敷き詰めスクロール を指定できます。
 *   ・座標は上画面の左上が原点(0〜400 x 0〜240)です。画像のフォルダは img/pictures か img/system。
 *   ・枠や飾り、光の演出、流れる雲など、戦闘画面の装飾に使えます。
 *
 * ■ 立ち絵HUD(SVキャラの代わりに、立ち絵+名前+HP+スタミナ)
 *   ・【立ち絵HUD】SVキャラの代わりに〜 をONにすると、戦闘中の上画面で SVキャラ(弧状の配置)を隠し、
 *     下端に前衛3人の「立ち絵・名前プレート・HPゲージ・スタミナゲージ」を表示します。
 *     ホイールを回すと、カードも一緒に横へスライドします。外へ出るカードはフェードアウトし、
 *     後衛から前衛へ入るカードは反対側からフェードインしながら滑り込みます。
 *   ・SVキャラが行動時に前へ出たり退いたりする動きは、この機能がONの間は全て止まります。
 *     ダメージ表示や戦闘アニメは、立ち絵の位置に出ます。
 *   ・立ち絵は、アクターごとに 通常/行動中/被弾/瀕死/戦闘不能 の5種類を指定できます
 *     (【アクターごとの立ち絵】。画像は img/pictures)。未指定の状態は通常の立ち絵で代用し、
 *     通常の立ち絵もないアクターは、顔グラフィックを表示します。
 *     メモ欄 <立ち絵:ファイル名> でも、通常の立ち絵を指定できます。
 *   ・HUDの全部品に画像を指定できます(カード背景 / 名前プレート / HPゲージ(背景・中身・枠) /
 *     スタミナゲージ(背景・中身・枠) / HP・スタミナのアイコン / エンブレム / 顔グラの枠 / 行動中の光)。
 *     未指定の部品は自動で描きます。画像は部品の大きさに引き伸ばして表示します(大きさは各パラメータの説明)。
 *   ・演出: 行動中のカードが浮いて光り、被弾で揺れて赤く光り、HPゲージは赤い遅延ゲージが追従して減り、
 *     戦闘不能は灰色になります(【演出】でON/OFF)。
 *
 * ■ 戦闘後リザルト(DualScreen3DS_BattleResult.js 統合)
 *   ・勝利すると、標準の「Victory!」メッセージの代わりに、2画面のリザルトを表示します。
 *     旧 DualScreen3DS_BattleResult.js は無効(削除)にしてください。
 *   ・上画面: 見出し(VICTORY!)と、味方6人(前衛3+後衛3)のカード。顔・名前・レベル・
 *     経験値ゲージが、この戦闘で得た分だけ伸びます。レベルアップ時はゲージが光り、
 *     星が弾けて「LEVEL UP!」と効果音が出ます。
 *   ・下画面: 獲得した経験値・ゴールドが数え上がり、ドロップアイテム(アイコン付き)が一覧されます。
 *     5つ以上の場合は自動でページ送りします。
 *   ・操作: 演出中に決定/キャンセル/クリック/タッチで、演出をスキップできます。
 *     もう一度押すか「つぎへ」ボタンで閉じ、戦闘終了処理(マップへ戻る等)に進みます。
 *   ・画像の追加: 【リザルト】上画面/下画面に重ねる画像(複数) に、好きな枚数の画像を登録できます。
 *     画像ごとに 位置・原点・拡大率・不透明度・合成方法(通常/加算/スクリーン/乗算)・
 *     重なり(奥/手前)・出現の仕方(フェード/スライド/ズーム)・常時の動き
 *     (ふわふわ/ゆらゆら/脈打つ/回転)・敷き詰めスクロール を指定できます。
 *     画像は img/system に置いてください。
 *   ・背景は、画像を指定しなければ背景色のグラデーション+流れるチェック柄です。
 *   ・カードの背景は、【リザルト】カードの背景を描く でON/OFFできます。
 *   ・リザルトの全てのUI部品に、画像を指定できます(未指定の部品は、自動で描きます)。
 *       見出し帯 / カード背景(前衛・後衛・空き枠) / 顔グラの枠 / 前後のチップ /
 *       経験値ゲージ(背景・中身・枠) / LEVEL UP!のリボン / 弾ける粒 /
 *       下画面の見出し・経験値/ゴールド/アイテムのパネル・アイコン / 「つぎへ」ボタン(通常・フォーカス・押下)
 *     画像は部品の大きさに引き伸ばして表示します。各パラメータの説明に、ぴったりの大きさを書いています。
 *     画像に文字が含まれている場合は、対応する文字の設定を空にしてください。
 *   ・BattleManager.processVictory を置き換えます。戦闘報酬/勝利メッセージを変更する
 *     他のプラグインと併用する場合は、読み込み順にご注意ください。
 *   ・スタミナの戦闘開始時の初期値も、この中で設定できます(【スタミナ】戦闘開始時の初期値)。
 *
 * ■ タイトル画面の下画面UI(画像ボタン + 背景)
 *   ・タイトルコマンドを、下画面の画像ボタンに置き換えます(コマンド処理は元のウィンドウのまま)。
 *   ・ボタンごとに「非フォーカス / フォーカス / 無効」の画像を指定できます。
 *     未指定のボタンは、自動生成のカプセル型ボタン(通常=青 / フォーカス=橙)になります。
 *     位置を空にすると、ボタンは下画面の中央に縦に自動で並びます。
 *   ・演出(登場・膨らみ・発光・光の帯・ふわふわ・凹み・波紋・決定フラッシュ・SE)は
 *     個別にON/OFFでき、まとめて無効にもできます。光の帯と波紋は画像の輪郭に沿って表示されます。
 *   ・下画面の背景は、既定ではチェック柄が斜めに流れます。背景画像を指定すると差し替わります
 *     (画像は敷き詰めてスクロール。流れる速さを0にすると固定)。
 *   ・マウスの移動、クリック、タッチ、キーボード、ゲームパッドで操作できます。
 *   ・タイトルのコマンド追加系プラグイン(シンボル付き)にも対応します。
 *
 * ■ ピクチャの上下画面表示 / PictureCallCommon(ピクチャのボタン化)対応
 *   ・「ピクチャの表示」「ピクチャの移動」等の標準イベントコマンドがそのまま使えます。
 *   ・ピクチャ番号が【ピクチャ】の範囲(既定51~100)なら下画面、それ以外は上画面に表示します。
 *     プラグインコマンド「ピクチャの表示先画面」で番号ごとに変更もできます。
 *     (スクリプト: $gameScreen.setPictureScreen(番号, "top"|"bottom"|"auto"))
 *   ・座標は表示先画面の左上が原点です。下画面なら X:0~320 / Y:0~240 です。
 *   ・下画面のピクチャは画面の揺れ・ズーム・色調変更の影響を受けません(UI向き)。
 *     下画面の外にはみ出した部分は表示されません。
 *   ・トリアコンタン氏 PictureCallCommon.js(ピクチャのボタン化)の当たり判定を
 *     下画面にも対応させます。上画面のピクチャは下画面のタッチに反応しません。
 *     ※PictureCallCommon.js は DualScreen3DS.js の上下どちらに読み込んでも動作します。
 *   ・表示先は途中で変更でき、セーブデータにも保存されます。
 *
 * ■ わざ(戦闘の左上ボタン): キャラ選択 → タイミングゲージ → 発動
 *   ・左上ボタンを押すと、ホイールからキャラを選ぶ状態になります。前衛の3人が金色の枠で光り、
 *     ホイールの区画(顔)をクリック/タッチ、または 左右キー+決定キー で選びます。
 *     後衛は暗くなって選べません。スタミナ不足・戦闘不能のキャラは×印で選べません。
 *     選んでいるキャラの名前・わざ名・スタミナの変化(または選べない理由)は、下画面の下部に表示します。
 *   ・キャラを選ぶと縦長のゲージが昇り降りします。頂点に来た瞬間に押すほど高倍率です。
 *     頂点付近(パーフェクト幅)で押すと最大倍率。押さずに放置すると最低倍率で自動発動します。
 *   ・止める操作は、ホイールの真ん中(ハブ)のボタンをクリック/タッチ、または 決定キー です。
 *     押した瞬間の効果音は【わざ】中央ボタンを押した効果音で変更できます。
 *     ゲージ中はホイールがうっすら見え、ハブが大きな「PUSH」ボタンになります。
 *     選択画面では 左右キーで選択、キャンセルキー/右クリック/「もどる」で戻れます。
 *   ・選択〜ゲージ中は、戦闘の時間(ATB)とスタミナ回復が止まります。
 *   ・わざは、撃ったキャラの「残りスタミナを全て消費」します(発動時に0になります)。
 *     最低スタミナ未満のキャラは選べません。通常の行動のスタミナ消費は既存の設定のままです。
 *   ・わざの指定: アクターのメモ欄に <わざ:スキルID>(または <waza:スキルID>)
 *     指定がなければ【既定のわざ】、それも0なら最初に覚えているスキルです。
 *   ・対象はランダム(敵単体のわざなら生きている敵からランダム)です。
 *
 * ■ 戦闘の4ボタン(妖怪ウォッチ風)
 *   ・戦闘中、下画面のホイール以外の部分を左上/右上/左下/右下の4つに分け、
 *     ホイールの円に沿った形のボタンにします。
 *   ・フォーカス(マウスを重ねる / 方向キー・十字キー)で光って少し膨らみ、
 *     クリック・タッチで凹んで波紋が広がり、決定すると光ります。
 *   ・ボタンごとにラベルと色、または画像(通常/フォーカス/押下)を設定できます。
 *     画像はボタンの矩形サイズに合わせて表示し、既定ではボタンの形(ホイールの円に沿った形)で
 *     切り抜くので、ホイール側にはみ出しません(【ボタン】画像をボタンの形で切り抜く)。
 *     画像のフィット方法(引き伸ばす/収める/覆う)も選べます。
 *   ・押したときの処理は未実装です。次のフックを上書きして使ってください。
 *       Scene_Battle.prototype.onWheelButton = function(index, label) { ... };
 *       (index: 0=左上 1=右上 2=左下 3=右下)
 *   ・SceneManager._scene.setWheelButtonEnabled(index, true|false) で無効化できます。
 *   ・コマンド/スキル等のウィンドウ操作中は、ボタンは暗くなり反応しません。
 *
 * ■ コンパクトUI
 *   文字サイズ・行の高さ・余白を小さくして、400x240 / 320x240 に収まりやすくします。
 *   各パラメータを0にするとMZ標準(または[データベース]の値)に戻ります。
 *   顔グラフィック(144x144)など画像サイズは変わりません。
 *
 * ■ 注意
 *   ・Graphicsの幅/高さを参照する他プラグインとは競合の可能性があります。
 *   ・画面解像度・UIエリアのシステム設定はこのプラグインが上書きします。
 *   ・NRP_MessageWindow.js の WindowImage / WindowImageName / NameBoxImage に対応。
 *     NRP_MessageWindow は DualScreen3DS より上に読み込んでも使用できます。
 *   ・ウィンドウ独自の配置(Scene_Message等)は下画面幅320を超えないよう
 *     必要に応じて調整してください。
 */
/*~struct~HudActor:ja
 * @param actorId
 * @text アクター
 * @type actor
 * @default 1
 *
 * @param image
 * @text 通常の立ち絵
 * @type file
 * @dir img/pictures
 * @desc 立ち絵(バストアップ等)。透過PNG推奨。高さは【立ち絵の高さ】に合わせて縮小されます。
 *
 * @param imageAction
 * @text 行動中の立ち絵
 * @type file
 * @dir img/pictures
 * @desc 未指定なら通常の立ち絵のままです。
 *
 * @param imageDamage
 * @text 被弾したときの立ち絵(約0.5秒)
 * @type file
 * @dir img/pictures
 *
 * @param imageLowHp
 * @text 瀕死(HP25%以下)の立ち絵
 * @type file
 * @dir img/pictures
 *
 * @param imageDead
 * @text 戦闘不能の立ち絵
 * @type file
 * @dir img/pictures
 * @desc 未指定なら通常の立ち絵を灰色にして表示します。
 *
 * @param offsetX
 * @text 位置のずらしX
 * @type number
 * @min -999
 * @default 0
 *
 * @param offsetY
 * @text 位置のずらしY
 * @type number
 * @min -999
 * @default 0
 *
 * @param scale
 * @text 拡大率(%)
 * @type number
 * @min 1
 * @default 100
 */
/*~struct~UiTextStyle:ja
 * @param target
 * @text 対象
 * @type select
 * @option 全部(個別の指定がないもの)
 * @value all
 * @option タイトル(ボタン)
 * @value title
 * @option 戦闘の四隅ボタン
 * @value wheelButton
 * @option わざ(選択・ゲージ・ハブ)
 * @value waza
 * @option リザルト
 * @value result
 * @option 立ち絵HUD
 * @value hud
 * @option 技名の帯
 * @value skill
 * @option ステージ表示
 * @value stage
 * @option 仲間化
 * @value recruit
 * @option 敵のHPゲージ(名前)
 * @value enemy
 * @default all
 *
 * @param fontFile
 * @text フォントファイル(fontsフォルダ)
 * @type string
 * @desc fontsフォルダ内のフォント名を文字入力します。例: MyFont.ttf / MyFont.otf / MyFont.woff2。拡張子を省略すると自動判定します。空ならゲームの標準フォント。
 *
 * @param textColor
 * @text 文字の色
 * @type string
 * @desc 白い文字をこの色にします(例: #ffd27a)。強調のために別の色を指定している文字(赤・緑など)は変わりません。空なら変更しません。
 *
 * @param outlineColor
 * @text 縁取りの色
 * @type string
 * @desc 例: rgba(0,0,0,0.9)。空なら変更しません。
 *
 * @param sizeScale
 * @text 文字サイズの倍率(%)
 * @type number
 * @min 10
 * @default 100
 */
/*~struct~EnemySize:ja
 * @param enemyId
 * @text 敵
 * @type enemy
 * @default 1
 *
 * @param scale
 * @text 大きさ(%)
 * @type number
 * @min 1
 * @desc 全体の拡大率に掛け算します。100で変化なし。
 * @default 100
 *
 * @param offsetX
 * @text 位置のずらしX
 * @type number
 * @min -999
 * @default 0
 *
 * @param offsetY
 * @text 位置のずらしY
 * @type number
 * @min -999
 * @default 0
 */
/*~struct~PictureEffect:ja
 * @param startId
 * @text 開始番号
 * @type number
 * @min 1
 * @default 51
 *
 * @param endId
 * @text 終了番号
 * @type number
 * @min 1
 * @default 100
 *
 * @param hoverScale
 * @text マウスを重ねたときの拡大(%)
 * @type number
 * @min 1
 * @desc 100で変化なし。
 * @default 106
 *
 * @param pressScale
 * @text 押している間の拡大(%)
 * @type number
 * @min 1
 * @desc 100未満で凹みます。
 * @default 94
 *
 * @param outline
 * @text アウトライン(輪郭線)を付ける
 * @type boolean
 * @desc 画像の不透明な部分の輪郭に沿って、太い線を表示します。
 * @default true
 *
 * @param outlineColor
 * @text アウトラインの色
 * @type string
 * @default #ffffff
 *
 * @param outlineWidth
 * @text アウトラインの太さ(px)
 * @type number
 * @min 1
 * @default 2
 *
 * @param outlineAlways
 * @text アウトラインを常に表示
 * @type boolean
 * @desc OFFなら、マウスを重ねたとき(押している間)だけ表示します。
 * @default false
 *
 * @param glow
 * @text 発光(輪郭の外側に滲む光)
 * @type boolean
 * @default false
 *
 * @param glowColor
 * @text 発光の色
 * @type string
 * @default #ffe9a0
 *
 * @param shine
 * @text 光の帯が走る
 * @type boolean
 * @desc 重ねたとき、と、重ねている間は一定間隔で、画像の形に沿って光が走ります。
 * @default false
 *
 * @param ripple
 * @text クリック位置から波紋
 * @type boolean
 * @default true
 *
 * @param bob
 * @text 常時ふわふわ上下(px)
 * @type number
 * @decimals 1
 * @min 0
 * @desc 0でなし。
 * @default 0
 *
 * @param pulse
 * @text 常時脈打つ拡大縮小(%)
 * @type number
 * @decimals 1
 * @min 0
 * @desc 0でなし。
 * @default 0
 *
 * @param hoverBrighten
 * @text 重ねたときに明るくする(0〜100)
 * @type number
 * @min 0
 * @max 100
 * @default 12
 *
 * @param pressDim
 * @text 押している間に暗くする(0〜100)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 *
 * @param alphaHit
 * @text 透明な部分は反応させない
 * @type boolean
 * @desc ONなら、画像の不透明な部分だけがマウスに反応します。OFFなら、四角い範囲全体が反応します。
 * @default true
 *
 * @param se
 * @text 効果音を鳴らす
 * @type boolean
 * @default true
 *
 * @param hoverSe
 * @text 重ねたときの効果音
 * @type file
 * @dir audio/se/
 * @desc 空欄ならシステム効果音の「カーソル」。
 *
 * @param clickSe
 * @text クリックしたときの効果音
 * @type file
 * @dir audio/se/
 * @desc 空欄ならシステム効果音の「決定」。
 *
 * @param seVolume
 * @text 効果音の音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */
/*~struct~RecruitEnemy:ja
 * @param enemyId
 * @text 敵
 * @type enemy
 * @default 1
 *
 * @param templateActorId
 * @text テンプレートのアクター
 * @type actor
 * @desc 仲間になったとき、このアクターのデータ(クラス・初期レベル・装備・顔グラ・特徴など)を複製して、新しいアクターを作ります。0なら【共通のテンプレート】。
 * @default 0
 *
 * @param rate
 * @text 倒したときに起き上がる確率(%)
 * @type number
 * @min 0
 * @max 100
 * @desc 空なら【共通の確率】。
 *
 * @param name
 * @text 仲間になったときの名前(空なら敵の名前)
 * @type string
 */
/*~struct~SkillBanner:ja
 * @param skillId
 * @text スキル
 * @type skill
 * @default 1
 *
 * @param text
 * @text 表示名(空ならスキル名)
 * @type string
 *
 * @param icon
 * @text アイコン画像
 * @type file
 * @dir img/system
 * @desc 指定すると、IconSetのアイコンの代わりにこの画像を表示します(正方形。帯の高さ-6px程度)。
 *
 * @param iconIndex
 * @text アイコン番号(IconSet)
 * @type number
 * @min -1
 * @desc -1ならスキルに設定されたアイコンを使います。アイコン画像を指定した場合は、画像が優先されます。
 * @default -1
 *
 * @param bgImage
 * @text 背景画像
 * @type file
 * @dir img/system
 * @desc この技だけの帯の背景。未指定なら共通の背景(または自動の帯)です。
 *
 * @param color1
 * @text 自動の帯の色(上)
 * @type string
 * @desc 背景画像がないときの色。空なら共通の色。
 *
 * @param color2
 * @text 自動の帯の色(下)
 * @type string
 */
/*~struct~BattleImage:ja
 * @param folder
 * @text 画像のフォルダ
 * @type select
 * @option img/pictures
 * @value pictures
 * @option img/system
 * @value system
 * @default pictures
 *
 * @param image
 * @text 画像
 * @type file
 * @dir img/pictures
 * @desc 上で選んだフォルダの画像ファイル名です(ここで選ぶと、フォルダが違う場合は手入力してください)。
 *
 * @param x
 * @text X(画面内)
 * @type number
 * @min -9999
 * @default 0
 *
 * @param y
 * @text Y(画面内)
 * @type number
 * @min -9999
 * @default 0
 *
 * @param origin
 * @text 原点
 * @type select
 * @option 左上
 * @value topLeft
 * @option 中央
 * @value center
 * @default topLeft
 *
 * @param scale
 * @text 拡大率(%)
 * @type number
 * @min 1
 * @default 100
 *
 * @param opacity
 * @text 不透明度(0~255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param blend
 * @text 合成方法
 * @type select
 * @option 通常
 * @value normal
 * @option 加算(光)
 * @value add
 * @option スクリーン
 * @value screen
 * @option 乗算(影)
 * @value multiply
 * @default normal
 *
 * @param layer
 * @text 重なり
 * @type select
 * @option 奥(戦闘背景の上・敵味方の後ろ)
 * @value back
 * @option 手前(敵味方・立ち絵HUDの前)
 * @value front
 * @default back
 *
 * @param tile
 * @text 画面全体に敷き詰める
 * @type boolean
 * @desc ONにすると、X/Yや原点は無視し、画面全体に繰り返し敷き詰めます(スクロール可)。
 * @default false
 *
 * @param scrollX
 * @text 流れる速さX(敷き詰め時)
 * @type number
 * @decimals 2
 * @min -20
 * @default 0
 *
 * @param scrollY
 * @text 流れる速さY(敷き詰め時)
 * @type number
 * @decimals 2
 * @min -20
 * @default 0
 *
 * @param appear
 * @text 出現の仕方
 * @type select
 * @option なし
 * @value none
 * @option フェードイン
 * @value fade
 * @option 左から
 * @value slideLeft
 * @option 右から
 * @value slideRight
 * @option 上から
 * @value slideUp
 * @option 下から
 * @value slideDown
 * @option ズーム
 * @value zoom
 * @default fade
 *
 * @param appearDelay
 * @text 出現までの待ち(フレーム)
 * @type number
 * @min 0
 * @default 0
 *
 * @param appearFrames
 * @text 出現にかける時間(フレーム)
 * @type number
 * @min 1
 * @default 20
 *
 * @param motion
 * @text 常時の動き
 * @type select
 * @option なし
 * @value none
 * @option ふわふわ(上下)
 * @value float
 * @option ゆらゆら(回転)
 * @value sway
 * @option 脈打つ(拡大縮小)
 * @value pulse
 * @option 回転し続ける
 * @value spin
 * @default none
 *
 * @param motionSpeed
 * @text 動きの速さ
 * @type number
 * @decimals 2
 * @min 0
 * @default 1
 *
 * @param motionAmount
 * @text 動きの大きさ(px / 度 / %)
 * @type number
 * @decimals 1
 * @min 0
 * @default 6
 */
/*~struct~ResultImage:ja
 * @param image
 * @text 画像
 * @type file
 * @dir img/system
 *
 * @param x
 * @text X(画面内)
 * @type number
 * @min -9999
 * @default 0
 *
 * @param y
 * @text Y(画面内)
 * @type number
 * @min -9999
 * @default 0
 *
 * @param origin
 * @text 原点
 * @type select
 * @option 左上
 * @value topLeft
 * @option 中央
 * @value center
 * @default topLeft
 *
 * @param scale
 * @text 拡大率(%)
 * @type number
 * @min 1
 * @default 100
 *
 * @param opacity
 * @text 不透明度(0~255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param blend
 * @text 合成方法
 * @type select
 * @option 通常
 * @value normal
 * @option 加算(光)
 * @value add
 * @option スクリーン
 * @value screen
 * @option 乗算(影)
 * @value multiply
 * @default normal
 *
 * @param layer
 * @text 重なり
 * @type select
 * @option 奥(カード・数値の後ろ)
 * @value back
 * @option 手前(カード・数値の前)
 * @value front
 * @default back
 *
 * @param tile
 * @text 画面全体に敷き詰める
 * @type boolean
 * @desc ONにすると、X/Yや原点は無視し、画面全体に繰り返し敷き詰めます(スクロール可)。
 * @default false
 *
 * @param scrollX
 * @text 流れる速さX(敷き詰め時)
 * @type number
 * @decimals 2
 * @min -20
 * @default 0
 *
 * @param scrollY
 * @text 流れる速さY(敷き詰め時)
 * @type number
 * @decimals 2
 * @min -20
 * @default 0
 *
 * @param appear
 * @text 出現の仕方
 * @type select
 * @option なし
 * @value none
 * @option フェードイン
 * @value fade
 * @option 左から
 * @value slideLeft
 * @option 右から
 * @value slideRight
 * @option 上から
 * @value slideUp
 * @option 下から
 * @value slideDown
 * @option ズーム
 * @value zoom
 * @default fade
 *
 * @param appearDelay
 * @text 出現までの待ち(フレーム)
 * @type number
 * @min 0
 * @default 0
 *
 * @param appearFrames
 * @text 出現にかける時間(フレーム)
 * @type number
 * @min 1
 * @default 20
 *
 * @param motion
 * @text 常時の動き
 * @type select
 * @option なし
 * @value none
 * @option ふわふわ(上下)
 * @value float
 * @option ゆらゆら(回転)
 * @value sway
 * @option 脈打つ(拡大縮小)
 * @value pulse
 * @option 回転し続ける
 * @value spin
 * @default none
 *
 * @param motionSpeed
 * @text 動きの速さ
 * @type number
 * @decimals 2
 * @min 0
 * @default 1
 *
 * @param motionAmount
 * @text 動きの大きさ(px / 度 / %)
 * @type number
 * @decimals 1
 * @min 0
 * @default 6
 */
/*~struct~StaminaActionCost:ja
 * @param skillId
 * @text スキルID
 * @type skill
 * @default 1
 *
 * @param cost
 * @text 消費量
 * @type number
 * @min 0
 * @default 10
 */
/*~struct~TitleButton:ja
 * @param symbol
 * @text コマンド識別子
 * @type string
 * @desc newGame / continue / options など。他プラグインで追加したコマンドはそのシンボルを指定します。
 * @default newGame
 *
 * @param label
 * @text ラベル(自動生成ボタン用)
 * @type string
 * @desc 空ならコマンド名(用語)を使います。画像を指定した場合は使いません。
 *
 * @param image
 * @text 非フォーカス時の画像
 * @type file
 * @dir img/system
 * @desc 指定すると、この画像のサイズでボタンを表示します(透過PNG推奨)。
 *
 * @param imageFocus
 * @text フォーカス時の画像
 * @type file
 * @dir img/system
 * @desc 未指定なら非フォーカス時の画像に演出だけを付けます。
 *
 * @param imageDisabled
 * @text 無効時の画像(コンティニュー不可など)
 * @type file
 * @dir img/system
 * @desc 未指定なら非フォーカス時の画像を灰色にして表示します。
 *
 * @param x
 * @text 中心X(下画面内・空なら自動)
 * @type string
 *
 * @param y
 * @text 中心Y(下画面内・空なら自動)
 * @type string
 */
/*~struct~WheelButton:ja
 * @param label
 * @text ラベル
 * @type string
 *
 * @param color1
 * @text 色(画面の角側)
 * @type string
 * @default #58b4ff
 *
 * @param color2
 * @text 色(ホイール側)
 * @type string
 * @default #1c4fb4
 *
 * @param image
 * @text 通常時の画像
 * @type file
 * @dir img/system
 * @desc 指定するとラベルや色は使わず、この画像をボタンの大きさに合わせて表示します。
 *
 * @param imageFocus
 * @text フォーカス時の画像
 * @type file
 * @dir img/system
 *
 * @param imagePress
 * @text 押下時の画像
 * @type file
 * @dir img/system
 */
/*~struct~WindowRule:ja
 * @param pattern
 * @text クラス名(正規表現)
 * @type string
 * @default ^Window_BattleLog$
 *
 * @param screen
 * @text 表示先
 * @type select
 * @option 上画面
 * @value top
 * @option 下画面
 * @value bottom
 * @default top
 */

(() => {
    "use strict";

    const script = document.currentScript;
    const PN = (script && decodeURIComponent(script.src).match(/([^/]+)\.js$/)?.[1]) || "DualScreen3DS";
    const prm = PluginManager.parameters(PN);

    const parseJson = (s, d) => { try { return JSON.parse(s == null ? "" : s); } catch (e) { return d; } };
    // プラグインパラメータ/メタ情報は環境によってnullになることがあるため、
    // trim() の前に必ず文字列へ正規化する。
    const safeText = v => v == null ? "" : String(v);
    const safeTrim = v => safeText(v).trim();

    //-------------------------------------------------------------------------
    // 設定
    //-------------------------------------------------------------------------
    const CFG = {
        topW: 400, topH: 240,       // 3DS 上画面
        botW: 320, botH: 240,       // 3DS 下画面
        margin: Number(prm.uiMargin ?? 4),
        gap: Number(prm.gap || 0),
        fontSize: Number(prm.uiFontSize ?? 20),
        lineHeight: Number(prm.uiLineHeight ?? 26),
        padding: Number(prm.uiPadding ?? 8),
        itemPadding: Number(prm.uiItemPadding ?? 6),
        scale: Number(prm.screenScale || 1.5),
        pixelated: prm.pixelated !== "false",
        bezel: prm.bezelColor || "#000000",
        botBack: prm.bottomBackColor || "#0b0f1a",
        botImg: prm.bottomBackImage || "",
        mapTouchTopOnly: prm.mapTouchTopOnly !== "false"
    };
    CFG.botX = (CFG.topW - CFG.botW) / 2;
    CFG.botY = CFG.topH + CFG.gap;
    CFG.physW = CFG.topW;
    CFG.physH = CFG.botY + CFG.botH;

    const bottomScenes = parseJson(prm.bottomScenes, []);
    const windowRules = parseJson(prm.windowRules, [])
        .map(s => parseJson(s, null))
        .filter(r => r && r.pattern)
        .map(r => ({ re: new RegExp(r.pattern), screen: r.screen === "bottom" ? "bottom" : "top" }));

    const classNames = obj => {
        const names = [];
        let p = Object.getPrototypeOf(obj);
        while (p && p !== Object.prototype) {
            if (p.constructor && p.constructor.name) names.push(p.constructor.name);
            p = Object.getPrototypeOf(p);
        }
        return names;
    };

    //-------------------------------------------------------------------------
    // Graphics : 実キャンバス=400x(480+gap)、論理サイズ=上画面
    //-------------------------------------------------------------------------
    Graphics.screenRect = function(type) {
        return type === "bottom"
            ? new Rectangle(CFG.botX, CFG.botY, CFG.botW, CFG.botH)
            : new Rectangle(0, 0, CFG.topW, CFG.topH);
    };

    Graphics.uiBox = function(type) {
        const r = this.screenRect(type);
        return { width: r.width - CFG.margin * 2, height: r.height - CFG.margin * 2 };
    };

    // 元のresizeを活かし、実キャンバスサイズ(400x480+間隔)を渡す
    const _Graphics_resize = Graphics.resize;
    Graphics.resize = function() {
        this._defaultScale = CFG.scale;
        _Graphics_resize.call(this, CFG.physW, CFG.physH);
        this._syncRendererSize();
        if (this._canvas && CFG.pixelated) {
            this._canvas.style.imageRendering = "pixelated";
        }
    };

    // PIXIレンダラーの描画サイズが実キャンバスとずれていたら合わせる
    Graphics._syncRendererSize = function() {
        const renderer = this._app && this._app.renderer;
        if (renderer && (renderer.screen.width !== this._width || renderer.screen.height !== this._height)) {
            renderer.resize(this._width, this._height);
        }
    };

    if (Graphics._updateAllElements) {
        const _Graphics_updateAllElements = Graphics._updateAllElements;
        Graphics._updateAllElements = function() {
            _Graphics_updateAllElements.apply(this, arguments);
            this._syncRendererSize();
        };
    }

    const currentUiScreen = () => {
        const scene = SceneManager._scene;
        return (!Graphics._forceTopBox && scene && scene._uiScreen) || "top";
    };

    const defineGetter = (name, getter) => {
        Object.defineProperty(Graphics, name, { get: getter, set: () => {}, configurable: true });
    };
    defineGetter("width", () => CFG.topW);
    defineGetter("height", () => CFG.topH);
    defineGetter("boxWidth", () => Graphics.uiBox(currentUiScreen()).width);
    defineGetter("boxHeight", () => Graphics.uiBox(currentUiScreen()).height);
    defineGetter("physicalWidth", () => Graphics._width);
    defineGetter("physicalHeight", () => Graphics._height);

    // マウス/タッチの「キャンバス内か」判定は、論理サイズ(上画面)ではなく実キャンバス全体で行う。
    // (論理高さ=240のままだと、下画面(Y>=240)のクリック・タッチが無視されてしまうため)
    Graphics.isInsideCanvas = function(x, y) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    };

    Scene_Boot.prototype.adjustWindow = function() {
        if (Utils.isNwjs()) {
            const xDelta = Math.round(Graphics._width * CFG.scale) - window.innerWidth;
            const yDelta = Math.round(Graphics._height * CFG.scale) - window.innerHeight;
            window.moveBy(-xDelta / 2, -yDelta / 2);
            window.resizeBy(xDelta, yDelta);
        }
    };

    // Spriteset(マップ/戦闘の描画)は必ず上画面基準で生成する
    const _Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
    Spriteset_Base.prototype.initialize = function() {
        Graphics._forceTopBox = true;
        try {
            _Spriteset_Base_initialize.apply(this, arguments);
        } finally {
            Graphics._forceTopBox = false;
        }
    };

    //-------------------------------------------------------------------------
    // Scene_Base : 上下独立の WindowLayer
    //-------------------------------------------------------------------------
    const _Scene_Base_initialize = Scene_Base.prototype.initialize;
    Scene_Base.prototype.initialize = function() {
        _Scene_Base_initialize.apply(this, arguments);
        this._uiScreen = classNames(this).some(n => bottomScenes.includes(n)) ? "bottom" : "top";
    };

    Scene_Base.prototype.createWindowLayer = function() {
        const m = CFG.margin;
        const bot = Graphics.screenRect("bottom");

        this._topWindowLayer = new WindowLayer();
        this._topWindowLayer.x = m;
        this._topWindowLayer.y = m;
        this.addChild(this._topWindowLayer);

        // 上画面の描画はみ出しを隠す枠 + 下画面の背景
        this._screenFrame = this.createScreenFrame();
        this.addChild(this._screenFrame);

        // 下画面のピクチャ層(下画面背景の上・下画面ウィンドウの下)
        this._bottomPictureLayer = new Sprite_BottomPictureLayer();
        this.addChild(this._bottomPictureLayer);
        if (this._spriteset && this._spriteset.attachBottomPictureLayer) {
            this._spriteset.attachBottomPictureLayer(this._bottomPictureLayer);
        }

        this._bottomWindowLayer = new WindowLayer();
        this._bottomWindowLayer.x = bot.x + m;
        this._bottomWindowLayer.y = bot.y + m;
        this.addChild(this._bottomWindowLayer);

        this._windowLayer = this.screenLayer(this._uiScreen);
    };

    Scene_Base.prototype.createScreenFrame = function() {
        const h = CFG.gap + CFG.botH;
        const bmp = new Bitmap(CFG.topW, h);
        bmp.fillRect(0, 0, CFG.topW, h, CFG.bezel);
        bmp.fillRect(CFG.botX, CFG.gap, CFG.botW, CFG.botH, CFG.botBack);
        if (CFG.botImg) {
            const img = ImageManager.loadSystem(CFG.botImg);
            img.addLoadListener(() => {
                bmp.blt(img, 0, 0, img.width, img.height, CFG.botX, CFG.gap, CFG.botW, CFG.botH);
            });
        }
        const sprite = new Sprite(bmp);
        sprite.y = CFG.topH;
        return sprite;
    };

    Scene_Base.prototype.screenLayer = function(type) {
        return type === "bottom" ? this._bottomWindowLayer : this._topWindowLayer;
    };

    Scene_Base.prototype.resolveWindowScreen = function(window) {
        if (window._uiScreen) return window._uiScreen;
        const names = classNames(window);
        for (const rule of windowRules) {
            if (names.some(n => rule.re.test(n))) return rule.screen;
        }
        return this._uiScreen;
    };

    Scene_Base.prototype.addWindow = function(window) {
        const type = this.resolveWindowScreen(window);
        window._uiScreen = type;
        this.screenLayer(type).addChild(window);

        // NRP_MessageWindowの画像SpriteはWindow自身の子なので、
        // WindowLayerを変更しても同じローカル座標系のまま描画する。
        refreshNrpWindowImageCompat(window);
    };

    Scene_Base.prototype.setScreenVisible = function(type, visible) {
        const layer = this.screenLayer(type);
        if (layer) layer.visible = visible;
        if (type === "top" && this._spriteset) this._spriteset.visible = visible;
        if (type === "bottom" && this._bottomPictureLayer) this._bottomPictureLayer.visible = visible;
    };

    //-------------------------------------------------------------------------
    // Window_Base : 表示先画面の指定 / タッチの画面判定
    //-------------------------------------------------------------------------
    Window_Base.prototype.uiScreen = function() {
        return this._uiScreen || "top";
    };

    Window_Base.prototype.setUiScreen = function(type) {
        this._uiScreen = type === "bottom" ? "bottom" : "top";
        const scene = SceneManager._scene;
        if (scene && scene.screenLayer && this.parent) {
            scene.screenLayer(this._uiScreen).addChild(this);
        }
    };

    const _Window_Base_isTouchedInsideFrame = Window_Base.prototype.isTouchedInsideFrame;
    Window_Base.prototype.isTouchedInsideFrame = function() {
        if (this._uiScreen && TouchInput.screen() !== this._uiScreen) return false;
        return _Window_Base_isTouchedInsideFrame.call(this);
    };

    //-------------------------------------------------------------------------
    // NRP_MessageWindow 互換
    //
    // NRP_MessageWindow は Window_Message / Window_NameBox の _container 内に
    // _windowImageSprite を作って WindowImage / NameBoxImage を表示します。
    // DualScreen3DSではWindowLayerを上下に分離するため、Windowそのものだけを
    // 別Layerへ移動し、内部のSprite階層・ローカル座標系は変更しません。
    //
    // またNRP側は createContents() 時に、初期高さと現在高さが異なる場合
    // _windowImageSprite.visible = false とするため、2画面側で高さが確定した後も
    // bitmapが存在する画像Spriteは表示状態を維持します。
    //-------------------------------------------------------------------------
    const refreshNrpWindowImageCompat = window => {
        if (!window || !window._windowImageSprite) return;

        const sprite = window._windowImageSprite;

        // NRPが設定したBitmapをそのまま使う。
        // ロード待ちの場合は、次のupdateで再確認する。
        if (sprite.bitmap) {
            sprite.visible = true;
        }

        // Windowの背景/文字Spriteより前面に置く。
        // NRP自身の位置指定(sprite.move)は変更しない。
        sprite.z = Math.max(Number(sprite.z || 0), 1);
    };

    // NRP_MessageWindowが既に読み込まれている場合の互換フック。
    if (typeof Window_Message !== "undefined") {
        const _DualScreen_NRP_Window_Message_createBackSprite =
            Window_Message.prototype._createBackSprite;

        if (_DualScreen_NRP_Window_Message_createBackSprite) {
            Window_Message.prototype._createBackSprite = function() {
                _DualScreen_NRP_Window_Message_createBackSprite.apply(this, arguments);
                refreshNrpWindowImageCompat(this);
            };
        }

        const _DualScreen_NRP_Window_Message_update =
            Window_Message.prototype.update;

        if (_DualScreen_NRP_Window_Message_update) {
            Window_Message.prototype.update = function() {
                _DualScreen_NRP_Window_Message_update.apply(this, arguments);
                refreshNrpWindowImageCompat(this);
            };
        }
    }

    // NameBoxImageも同じ理由で互換処理する。
    if (typeof Window_NameBox !== "undefined") {
        const _DualScreen_NRP_Window_NameBox_createBackSprite =
            Window_NameBox.prototype._createBackSprite;

        if (_DualScreen_NRP_Window_NameBox_createBackSprite) {
            Window_NameBox.prototype._createBackSprite = function() {
                _DualScreen_NRP_Window_NameBox_createBackSprite.apply(this, arguments);
                refreshNrpWindowImageCompat(this);
            };
        }

        const _DualScreen_NRP_Window_NameBox_update =
            Window_NameBox.prototype.update;

        if (_DualScreen_NRP_Window_NameBox_update) {
            Window_NameBox.prototype.update = function() {
                _DualScreen_NRP_Window_NameBox_update.apply(this, arguments);
                refreshNrpWindowImageCompat(this);
            };
        }
    }

    //-------------------------------------------------------------------------
    // コンパクトUI : 小さい画面に収まるよう文字・行・余白を詰める
    //-------------------------------------------------------------------------
    if (CFG.fontSize > 0) {
        Game_System.prototype.mainFontSize = function() { return CFG.fontSize; };
    }
    if (CFG.padding > 0) {
        Game_System.prototype.windowPadding = function() { return CFG.padding; };
    }
    if (CFG.lineHeight > 0) {
        Window_Base.prototype.lineHeight = function() { return CFG.lineHeight; };
    }
    if (CFG.itemPadding > 0) {
        Window_Base.prototype.itemPadding = function() { return CFG.itemPadding; };
    }

    //-------------------------------------------------------------------------
    // ピクチャの上下画面表示 + PictureCallCommon(ピクチャのボタン化)対応
    //   上画面のピクチャ : 従来どおり Spriteset 内(揺れ/ズームの影響を受ける)
    //   下画面のピクチャ : 下画面専用の層へ移動(ローカル座標=下画面の左上が原点)
    //-------------------------------------------------------------------------
    const PIC_FROM = Number(prm.bottomPictureFrom ?? 51);
    const PIC_TO = Number(prm.bottomPictureTo ?? 100);

    const pictureScreenOf = id => {
        const map = $gameScreen && $gameScreen._pictureScreens;
        if (map && map[id]) return map[id];
        return (PIC_FROM > 0 && id >= PIC_FROM && id <= PIC_TO) ? "bottom" : "top";
    };

    Game_Screen.prototype.pictureScreen = function(pictureId) {
        return pictureScreenOf(pictureId);
    };

    Game_Screen.prototype.setPictureScreen = function(pictureId, screen) {
        if (!this._pictureScreens) this._pictureScreens = {};
        if (screen === "top" || screen === "bottom") {
            this._pictureScreens[pictureId] = screen;
        } else {
            delete this._pictureScreens[pictureId];   // auto
        }
    };

    PluginManager.registerCommand(PN, "setPictureScreen", args => {
        const start = Math.max(1, Number(args.startId) || 1);
        const end = Number(args.endId) > 0 ? Number(args.endId) : start;
        for (let id = start; id <= end; id++) {
            $gameScreen.setPictureScreen(id, args.screen);
        }
    });

    // 下画面のピクチャ層。下画面の矩形で切り取る(高速な矩形マスク)
    class Sprite_BottomPictureLayer extends Sprite {
        initialize() {
            super.initialize();
            const r = Graphics.screenRect("bottom");
            this.x = r.x;
            this.y = r.y;
            if (window.PIXI && PIXI.Graphics && PIXI.Graphics.prototype.isFastRect) {
                const g = new PIXI.Graphics();
                g.beginFill(0xffffff);
                g.drawRect(0, 0, r.width, r.height);
                g.endFill();
                this.addChild(g);
                this.mask = g;
            }
        }

        // Sceneからは更新せず、Spriteset(ピクチャコンテナ)の更新に含める。
        // PictureCallCommon の「同フレームでのタッチ抑制」と同じ順序で動かすため。
        update() {}

        updateFromSpriteset() {
            super.update();
        }
    }

    const insertPictureSorted = (container, sprite) => {
        const id = sprite._pictureId;
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
            const c = children[i];
            if (c !== sprite && c._pictureId !== undefined && c._pictureId > id) {
                container.addChildAt(sprite, i);
                return;
            }
        }
        container.addChild(sprite);
    };

    Spriteset_Base.prototype.attachBottomPictureLayer = function(layer) {
        const pc = this._pictureContainer;
        if (!pc) return;
        this._bottomPictureLayer = layer;
        this._pictureSprites = pc.children.filter(c => c._pictureId !== undefined);
        const baseUpdate = pc.update;
        pc.update = function() {
            baseUpdate.apply(this, arguments);
            layer.updateFromSpriteset();
        };
        this.syncPictureLayers();
    };

    // ピクチャごとの表示先(上/下)に合わせてスプライトの親を付け替える
    Spriteset_Base.prototype.syncPictureLayers = function() {
        const layer = this._bottomPictureLayer;
        if (!layer || !this._pictureSprites) return;
        for (const sprite of this._pictureSprites) {
            const want = pictureScreenOf(sprite._pictureId);
            const inBottom = sprite.parent === layer;
            if (want === "bottom" && !inBottom) {
                insertPictureSorted(layer, sprite);
            } else if (want !== "bottom" && inBottom) {
                insertPictureSorted(this._pictureContainer, sprite);
            }
        }
    };

    const _Spriteset_Base_update_ds = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        this.syncPictureLayers();   // 子の更新ループの外で付け替える
        _Spriteset_Base_update_ds.apply(this, arguments);
    };

    // PictureCallCommon のタッチ判定を、表示先画面の座標系に合わせる。
    // (そのプラグインは TouchInput.x/y と pic.x/y を直接比較する実装のため)
    //   ・下画面のピクチャ: タッチ座標から下画面の原点を引く(ズーム補正はしない)
    //   ・上下とも: 自分の画面の外のタッチには反応しない
    const patchPictureTouch = touch => {
        touch._ds3dsPatched = true;
        const proto = Object.getPrototypeOf(touch);
        const screenOf = () => pictureScreenOf(touch._pictureId);
        const bottom = Graphics.screenRect("bottom");

        if (proto.getTouchScreenX) {
            touch.getTouchScreenX = function(x) {
                return screenOf() === "bottom" ? x - bottom.x : proto.getTouchScreenX.call(this, x);
            };
        }
        if (proto.getTouchScreenY) {
            touch.getTouchScreenY = function(y) {
                return screenOf() === "bottom" ? y - bottom.y : proto.getTouchScreenY.call(this, y);
            };
        }
        if (proto.isOnPicturePos) {
            touch.isOnPicturePos = function(x = TouchInput.x, y = TouchInput.y) {
                if (!Graphics.screenRect(screenOf()).contains(x, y)) return false;
                return proto.isOnPicturePos.call(this, x, y);
            };
        }
    };

    const _Sprite_Picture_update_ds = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        // PictureCallCommon の読み込み順に関係なく、_touch が出来ていれば一度だけ差し替える
        if (this._touch && !this._touch._ds3dsPatched) patchPictureTouch(this._touch);
        _Sprite_Picture_update_ds.apply(this, arguments);
    };

    //-------------------------------------------------------------------------
    // ピクチャのボタンエフェクト(アウトライン・拡大・光・波紋 など)
    //-------------------------------------------------------------------------
    const PFX = (() => {
        const bool = (v, d) => (v === undefined || v === null || v === "" ? d : (v === true || v === "true"));
        const num = (v, d) => (v === undefined || v === null || safeTrim(v) === "" || isNaN(Number(v)) ? d : Number(v));
        const defaults = ['{"startId":"51","endId":"100","hoverScale":"106","pressScale":"94","outline":"true","ripple":"true","hoverBrighten":"12","pressDim":"25"}'];
        const raw = prm.pictureEffects !== undefined ? parseJson(prm.pictureEffects, []) : defaults;
        return raw.map(str => (typeof str === "string" ? parseJson(str, null) : str)).filter(Boolean).map(d => ({
            start: num(d.startId, 1),
            end: Math.max(num(d.startId, 1), num(d.endId, 100)),
            hoverScale: num(d.hoverScale, 106) / 100,
            pressScale: num(d.pressScale, 94) / 100,
            outline: bool(d.outline, true),
            outlineColor: d.outlineColor || "#ffffff",
            outlineWidth: Math.max(1, Math.round(num(d.outlineWidth, 2))),
            outlineAlways: bool(d.outlineAlways, false),
            glow: bool(d.glow, false),
            glowColor: d.glowColor || "#ffe9a0",
            shine: bool(d.shine, false),
            ripple: bool(d.ripple, true),
            bob: num(d.bob, 0),
            pulse: num(d.pulse, 0) / 100,
            brighten: rsClampPfx(num(d.hoverBrighten, 12), 0, 100) / 100,
            pressDim: rsClampPfx(num(d.pressDim, 25), 0, 100) / 100,
            alphaHit: bool(d.alphaHit, true),
            se: bool(d.se, true),
            hoverSe: String(d.hoverSe || ""),
            clickSe: String(d.clickSe || ""),
            seVolume: num(d.seVolume, 90)
        }));
    })();
    function rsClampPfx(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    const pfxConfigOf = id => PFX.find(c => id >= c.start && id <= c.end) || null;
    const pfxDisabled = id => !!($gameScreen && $gameScreen._pfxOff && $gameScreen._pfxOff[id]);

    PluginManager.registerCommand(PN, "setPictureEffect", args => {
        const start = Math.max(1, Number(args.startId) || 1);
        const end = Number(args.endId) > 0 ? Number(args.endId) : start;
        if (!$gameScreen._pfxOff) $gameScreen._pfxOff = {};
        for (let id = start; id <= end; id++) {
            if (args.enabled === "false") $gameScreen._pfxOff[id] = true;
            else delete $gameScreen._pfxOff[id];
        }
    });

    // 重なっているピクチャのうち、一番手前だけを反応させる(前フレームの結果を使う)
    const pfxShared = { hits: [], topId: 0 };
    const _Spriteset_Base_update_pfx = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        pfxShared.topId = pfxShared.hits.length > 0 ? Math.max(...pfxShared.hits) : 0;
        pfxShared.hits = [];
        _Spriteset_Base_update_pfx.apply(this, arguments);
    };

    const pfxSe = (name, volume, fallback) => {
        if (name) AudioManager.playSe({ name, volume, pitch: 100, pan: 0 });
        else if (fallback) fallback();
    };

    // 輪郭だけの画像(元画像を多方向にずらして太らせ、元画像の部分をくり抜く)。ビットマップごとにキャッシュ
    const pfxCache = new WeakMap();
    const pfxCached = (bmp, key, make) => {
        let m = pfxCache.get(bmp);
        if (!m) { m = {}; pfxCache.set(bmp, m); }
        if (!(key in m)) m[key] = make();
        return m[key];
    };
    const pfxMakeOutline = (src, color, r) => {
        const el = ttElement(src);
        if (!el || src.width <= 0) return null;
        const W = src.width + r * 2, H = src.height + r * 2;
        const bmp = new Bitmap(W, H), ctx = bmp.context;
        const n = Math.max(12, r * 6);
        for (let i = 0; i < n; i++) {
            const a = i / n * Math.PI * 2;
            ctx.drawImage(el, r + Math.cos(a) * r, r + Math.sin(a) * r);
        }
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "destination-out";     // 元画像の中は抜いて、外側の線だけにする
        ctx.drawImage(el, r, r);
        ctx.globalCompositeOperation = "source-over";
        bmp._baseTexture.update();
        return bmp;
    };
    // 発光(輪郭の外側へ滲む光)
    const PFX_GLOW_PAD = 14;
    const pfxMakeGlow = (src, color) => {
        const el = ttElement(src);
        if (!el || src.width <= 0) return null;
        const P = PFX_GLOW_PAD;
        const bmp = new Bitmap(src.width + P * 2, src.height + P * 2), ctx = bmp.context;
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 10000;        // 本体は画面外へ、影だけを残す
        for (let i = 0; i < 3; i++) ctx.drawImage(el, P - 10000, P);
        ctx.restore();
        bmp._baseTexture.update();
        return bmp;
    };

    // ピクチャ1枚ぶんの演出の状態と、子スプライト(アウトライン/発光/光の帯・波紋)
    class PictureFx {
        constructor() {
            this.age = 0;
            this.focus = 0;
            this.press = 0;
            this.hover = false;
            this.shineT = -1;
            this.ripple = -1;
            this.rx = 0;
            this.ry = 0;
            this.fxDirty = false;
            this.bmp = null;
            this.cfg = null;
            this.children = [];
        }

        release(sprite) {
            for (const c of this.children) if (c.parent) c.parent.removeChild(c);
            this.children = [];
            this.outline = this.glow = this.fx = null;
            this.bmp = this.cfg = null;
            if (sprite) sprite.setBlendColor([0, 0, 0, 0]);
        }

        build(sprite, cfg) {
            const bmp = sprite.bitmap;
            if (this.bmp === bmp && this.cfg === cfg) return;
            this.release(null);
            this.bmp = bmp;
            this.cfg = cfg;
            if (cfg.outline) {
                const ob = pfxCached(bmp, "o:" + cfg.outlineColor + ":" + cfg.outlineWidth, () => pfxMakeOutline(bmp, cfg.outlineColor, cfg.outlineWidth));
                if (ob) { this.outline = new Sprite(ob); sprite.addChildAt(this.outline, 0); this.children.push(this.outline); }
            }
            if (cfg.glow) {
                const gb = pfxCached(bmp, "g:" + cfg.glowColor, () => pfxMakeGlow(bmp, cfg.glowColor));
                if (gb) { this.glow = new Sprite(gb); this.glow.blendMode = 1; this.glow.opacity = 0; sprite.addChildAt(this.glow, 0); this.children.push(this.glow); }
            }
            if (cfg.shine || cfg.ripple) {
                this.fx = new Sprite(new Bitmap(bmp.width, bmp.height));
                sprite.addChild(this.fx);
                this.children.push(this.fx);
            }
        }

        // 子スプライトを、ピクチャの原点(anchor)に合わせて置く
        layout(sprite, cfg) {
            const w = sprite.bitmap.width, h = sprite.bitmap.height;
            const ax = sprite.anchor.x, ay = sprite.anchor.y;
            if (this.outline) {
                const r = cfg.outlineWidth;
                this.outline.anchor.set((ax * w + r) / (w + r * 2), (ay * h + r) / (h + r * 2));
                this.outline.opacity = Math.round(255 * (cfg.outlineAlways ? 1 : Math.max(this.focus, this.press)));
            }
            if (this.glow) {
                const P = PFX_GLOW_PAD;
                this.glow.anchor.set((ax * w + P) / (w + P * 2), (ay * h + P) / (h + P * 2));
                this.glow.opacity = Math.round(255 * this.focus * (0.7 + 0.3 * Math.sin(this.age / 6)));
            }
            if (this.fx) this.fx.anchor.set(ax, ay);
        }

        // 光の帯・波紋を描き、画像の不透明な部分だけ残す
        drawFx(sprite, cfg) {
            const b = this.fx.bitmap, ctx = b.context, w = b.width, h = b.height;
            b.clear();
            ctx.save();
            if (this.shineT >= 0) {
                ctx.save();
                ctx.translate(-30 + (w + 60) * this.shineT, 0);
                ctx.transform(1, 0, -0.45, 1, 0, 0);
                const g = ctx.createLinearGradient(-Math.max(14, w * 0.08), 0, Math.max(14, w * 0.08), 0);
                g.addColorStop(0, "rgba(255,255,255,0)");
                g.addColorStop(0.5, "rgba(255,255,255,0.6)");
                g.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = g;
                const bw = Math.max(14, w * 0.08);
                ctx.fillRect(-bw, -10, bw * 2, h + 20);
                ctx.restore();
            }
            if (this.ripple >= 0) {
                const t = this.ripple;
                const rad = 6 + Math.max(w, h) * 0.9 * (1 - Math.pow(1 - t, 2));
                const a = 0.85 * (1 - t);
                ctx.beginPath();
                ctx.arc(this.rx, this.ry, rad, 0, Math.PI * 2);
                ctx.lineWidth = 3 + 4 * (1 - t);
                ctx.strokeStyle = "rgba(255,255,255," + a.toFixed(3) + ")";
                ctx.stroke();
                ctx.fillStyle = "rgba(255,255,255," + (a * 0.2).toFixed(3) + ")";
                ctx.fill();
            }
            const el = ttElement(sprite.bitmap);
            if (el) {
                ctx.globalCompositeOperation = "destination-in";
                ctx.drawImage(el, 0, 0, w, h);
            }
            ctx.restore();
            b._baseTexture.update();
        }
    }

    // Sprite_Picture ごとの毎フレームの更新(元の更新のあとに、拡大・色味・子スプライトを重ねる)
    const pfxUpdate = sprite => {
        const id = sprite._pictureId;
        const cfg = sprite.picture() ? pfxConfigOf(id) : null;
        const bmp = sprite.bitmap;
        if (!cfg || pfxDisabled(id) || !bmp || !bmp.isReady() || bmp.width <= 0 || !sprite.visible) {
            if (sprite._pfx) sprite._pfx.release(sprite);
            return;
        }
        const fx = sprite._pfx || (sprite._pfx = new PictureFx());
        fx.build(sprite, cfg);
        fx.age++;

        // マウス(タッチ)が、画像の上にあるか(透明な部分は除く)
        let hit = false, lx = 0, ly = 0;
        const usePointer = !Utils.isMobileDevice() || TouchInput.isPressed();
        if (usePointer && TouchInput.screen() === pictureScreenOf(id) && sprite.worldAlpha > 0.01) {
            const p = sprite.worldTransform.applyInverse(new Point(TouchInput.x, TouchInput.y));
            const w = bmp.width, h = bmp.height;
            const px = p.x + sprite.anchor.x * w, py = p.y + sprite.anchor.y * h;
            if (px >= 0 && py >= 0 && px < w && py < h) {
                hit = !cfg.alphaHit || bmp.getAlphaPixel(Math.floor(px), Math.floor(py)) > 20;
                lx = px;
                ly = py;
            }
        }
        if (hit) pfxShared.hits.push(id);
        const hover = hit && (pfxShared.topId === 0 || pfxShared.topId === id);
        if (hover && !fx.hover) {                                   // 重なった瞬間
            if (cfg.se) pfxSe(cfg.hoverSe, cfg.seVolume, () => SoundManager.playCursor());
            if (cfg.shine) fx.shineT = 0;
        }
        fx.hover = hover;
        const pressed = hover && TouchInput.isPressed();
        if (hover && TouchInput.isTriggered()) {                    // クリックした瞬間
            if (cfg.se) pfxSe(cfg.clickSe, cfg.seVolume, () => SoundManager.playOk());
            if (cfg.ripple && fx.fx) { fx.ripple = 0; fx.rx = lx; fx.ry = ly; }
        }
        if (hover && cfg.shine && fx.shineT < 0 && fx.age % 100 === 0) fx.shineT = 0;

        fx.focus += Math.max(-0.2, Math.min(0.2, (hover ? 1 : 0) - fx.focus));
        fx.press += Math.max(-0.3, Math.min(0.3, (pressed ? 1 : 0) - fx.press));

        // 拡大縮小・ふわふわ(元の更新で決まった値に、倍率・ずれを重ねる)
        let k = 1 + (cfg.hoverScale - 1) * fx.focus - (1 - cfg.pressScale) * fx.press;
        if (cfg.pulse > 0) k *= 1 + Math.sin(fx.age / 10) * cfg.pulse;
        sprite.scale.x *= k;
        sprite.scale.y *= k;
        if (cfg.bob > 0) sprite.y += Math.sin(fx.age / 14) * cfg.bob;
        // 色味: 重ねたら明るく / 押している間は暗く
        const white = cfg.brighten * fx.focus;
        if (white > 0.005) sprite.setBlendColor([255, 255, 255, Math.round(255 * white)]);
        else sprite.setBlendColor([0, 0, 0, Math.round(255 * cfg.pressDim * fx.press)]);

        // 光の帯・波紋の進行
        if (fx.fx) {
            let dirty = false;
            if (fx.shineT >= 0) { fx.shineT += 0.05; if (fx.shineT >= 1) fx.shineT = -1; dirty = true; }
            if (fx.ripple >= 0) { fx.ripple += 0.045; if (fx.ripple >= 1) fx.ripple = -1; dirty = true; }
            if (dirty || fx.fxDirty) { fx.drawFx(sprite, cfg); fx.fxDirty = dirty; }
        }
        fx.layout(sprite, cfg);
    };

    const _Sprite_Picture_update_pfx = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update_pfx.apply(this, arguments);
        if (PFX.length > 0) pfxUpdate(this);
    };

    //-------------------------------------------------------------------------
    // UIテーマ: ソリッド(女神転生IV風) / ポップ(従来)
    //-------------------------------------------------------------------------
    const UI = {
        solid: prm.uiTheme !== "pop",
        accent: prm.uiAccent || "#f08a24",
        hot: prm.uiAccentHot || "#ff4a2a",
        base: prm.uiBase || "#0d0f13",
        base2: prm.uiBase2 || "#1b1f27",
        line: "#9aa3b2"
    };
    // 従来の既定色のまま(=変更されていない)ならソリッド用の色、変更されていればその色
    const uiTheme = (value, classic, solid) => {
        const v = safeTrim(value);
        return UI.solid && (v === "" || v.toLowerCase() === classic.toLowerCase()) ? solid : (v || classic);
    };
    const uiRgb = hex => {
        const m = /^#?([0-9a-f]{6})$/i.exec(safeTrim(hex));
        const n = m ? parseInt(m[1], 16) : 0x888888;
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    // f<0で黒方向、f>0で白方向に寄せた色
    const uiShade = (hex, f) => {
        const [r, g, b] = uiRgb(hex);
        const t = f < 0 ? 0 : 255, p = Math.abs(f);
        const mix = v => Math.round(v + (t - v) * p);
        return "rgb(" + mix(r) + "," + mix(g) + "," + mix(b) + ")";
    };
    // 四隅を斜めに切った(面取り)四角形のパス
    const uiChamfer = (ctx, x, y, w, h, c) => {
        c = Math.max(0, Math.min(c, w / 2, h / 2));
        ctx.beginPath();
        ctx.moveTo(x + c, y);
        ctx.lineTo(x + w - c, y);
        ctx.lineTo(x + w, y + c);
        ctx.lineTo(x + w, y + h - c);
        ctx.lineTo(x + w - c, y + h);
        ctx.lineTo(x + c, y + h);
        ctx.lineTo(x, y + h - c);
        ctx.lineTo(x, y + c);
        ctx.closePath();
    };
    // ソリッドなパネル: 暗い面(縦にわずかなグラデーション)+ 外枠 + 内側の細い線
    const uiPanel = (ctx, x, y, w, h, o = {}) => {
        const c = o.c ?? 5, bw = o.bw ?? 1.5;
        uiChamfer(ctx, x, y, w, h, c);
        const g = ctx.createLinearGradient(0, y, 0, y + h);
        g.addColorStop(0, o.top || UI.base2);
        g.addColorStop(1, o.bottom || UI.base);
        ctx.fillStyle = g;
        ctx.fill();
        uiChamfer(ctx, x + bw / 2, y + bw / 2, w - bw, h - bw, c);
        ctx.lineWidth = bw;
        ctx.strokeStyle = o.border || UI.accent;
        ctx.stroke();
        if (o.inner !== false && w > 14 && h > 14) {
            uiChamfer(ctx, x + bw + 2, y + bw + 2, w - (bw + 2) * 2, h - (bw + 2) * 2, Math.max(0, c - 2));
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255,255,255,0.10)";
            ctx.stroke();
        }
    };

    //-------------------------------------------------------------------------
    // UIの文字: フォント(fontsフォルダのファイル名)と色
    //-------------------------------------------------------------------------
    const UI_TEXT_STYLES = (() => {
        const map = {};
        parseJson(prm.uiTextStyles, []).map(str => parseJson(str, null)).filter(Boolean).forEach(d => {
            const n = Number(d.sizeScale);
            map[d.target || "all"] = {
                font: String(d.fontFile || ""),
                color: String(d.textColor || ""),
                outline: String(d.outlineColor || ""),
                scale: n > 0 ? n / 100 : undefined
            };
        });
        return map;
    })();
    let uiCat = "";                 // いま描いているUIの対象(uiCategorize が設定)
    const uiStyleCache = {};
    const uiStyleOf = cat => {
        if (!(cat in uiStyleCache)) {
            const base = UI_TEXT_STYLES.all || {}, own = UI_TEXT_STYLES[cat] || {};
            uiStyleCache[cat] = {
                font: own.font || base.font || "",
                color: own.color || base.color || "",
                outline: own.outline || base.outline || "",
                scale: own.scale ?? base.scale ?? 1
            };
        }
        return uiStyleCache[cat];
    };
    const uiTextColor = c => {
        const st = uiStyleOf(uiCat);
        return st.color && /^#(fff|ffffff)$/i.test(c) ? st.color : c;
    };
    // fonts フォルダのフォントを読み込む(拡張子がなければ ttf/otf/woff/woff2 を順に試す)
    const uiFonts = {};
    const uiLoadFont = file => {
        if (uiFonts[file]) return uiFonts[file].family;
        const family = "ds3dsFont" + Object.keys(uiFonts).length;
        uiFonts[file] = { family, state: "loading" };
        const candidates = /\.(ttf|otf|woff2?|ttc)$/i.test(file)
            ? [file] : [file + ".ttf", file + ".otf", file + ".woff", file + ".woff2"];
        const tryNext = i => {
            if (i >= candidates.length || !window.FontFace) { uiFonts[file].state = "error"; return; }
            const url = "fonts/" + candidates[i].split("/").map(encodeURIComponent).join("/");
            const face = new FontFace(family, "url(" + url + ")");
            face.load().then(() => {
                document.fonts.add(face);
                uiFonts[file].state = "loaded";
                rsImgVer++;                        // 描き直しの合図
            }).catch(() => tryNext(i + 1));
        };
        tryNext(0);
        return family;
    };
    const uiFace = (cat = uiCat) => {
        const st = uiStyleOf(cat);
        const main = $gameSystem.mainFontFace();
        return st.font ? uiLoadFont(st.font) + ", " + main : main;
    };
    // クラスのメソッドを、実行中だけ uiCat を切り替えるように包む
    const uiCategorize = (klass, cat, methods) => {
        if (!klass) return;
        for (const name of methods) {
            const f = klass.prototype[name];
            if (typeof f !== "function") continue;
            klass.prototype[name] = function(...args) {
                const prev = uiCat;
                uiCat = cat;
                try { return f.apply(this, args); } finally { uiCat = prev; }
            };
        }
    };

    //-------------------------------------------------------------------------
    // タイトル画面の下画面UI(画像ボタン + 流れる背景)
    //-------------------------------------------------------------------------
    const TT = (() => {
        const on = (v, d = true) => (v === undefined || v === "" ? d : v !== "false");
        const master = on(prm.titleFxEnabled);
        const fx = key => master && on(prm[key]);
        return {
            enabled: on(prm.titleUiEnabled),
            w: Number(prm.titleButtonWidth || 200),
            h: Number(prm.titleButtonHeight || 44),
            spacing: Number(prm.titleButtonSpacing ?? 10),
            centerY: Number(prm.titleButtonsY ?? 128),
            font: Number(prm.titleButtonFontSize || 22),
            c: {
                n1: prm.titleColorNormal1 || "#5aa8f0", n2: prm.titleColorNormal2 || "#2a62c4",
                f1: prm.titleColorFocus1 || "#ffd45a", f2: prm.titleColorFocus2 || "#f0861c"
            },
            bgImage: prm.titleBgImage || "",
            bg1: uiTheme(prm.titleBgColor1, "#24418f", "#0e1117"),
            bg2: uiTheme(prm.titleBgColor2, "#3157b8", "#171c26"),
            check: Math.max(4, Number(prm.titleBgCheckSize || 32)),
            sx: Number(prm.titleBgScrollX ?? 0.5),
            sy: Number(prm.titleBgScrollY ?? 0.5),
            vignette: on(prm.titleBgVignette),
            appear: fx("titleFxAppear"), pop: fx("titleFxPop"), glow: fx("titleFxGlow"),
            shine: fx("titleFxShine"), float: fx("titleFxFloat"), press: fx("titleFxPress"),
            ripple: fx("titleFxRipple"), decide: fx("titleFxDecide"), se: on(prm.titleFxSe)
        };
    })();

    const TITLE_DEFS = {};
    parseJson(prm.titleButtons, []).forEach(str => {
        const d = parseJson(str, null);
        if (d && d.symbol) TITLE_DEFS[d.symbol] = d;
    });
    const toNumOrNull = v => (v === undefined || v === null || safeTrim(v) === "" || isNaN(Number(v))) ? null : Number(v);
    const ttApproach = (cur, target, speed) => cur + Math.max(-speed, Math.min(speed, target - cur));
    const ttElement = bmp => bmp && (bmp._canvas || bmp._image);

    // ----- 背景: チェック柄(または画像)が流れる -----
    class Sprite_TitleBottomBackground extends Sprite {
        initialize() {
            super.initialize();
            const r = Graphics.screenRect("bottom");
            this.x = r.x;
            this.y = r.y;
            this._tiling = new TilingSprite();
            this._tiling.move(0, 0, r.width, r.height);
            this._tiling.bitmap = TT.bgImage ? ImageManager.loadSystem(TT.bgImage) : this.makeChecker();
            this.addChild(this._tiling);
            if (TT.vignette) {
                const v = new Sprite(this.makeVignette(r.width, r.height));
                this.addChild(v);
            }
        }

        makeChecker() {
            const S = TT.check;
            const bmp = new Bitmap(S * 2, S * 2);
            const ctx = bmp.context;
            ctx.fillStyle = TT.bg1;
            ctx.fillRect(0, 0, S * 2, S * 2);
            ctx.fillStyle = TT.bg2;
            ctx.fillRect(0, 0, S, S);
            ctx.fillRect(S, S, S, S);
            // マスの境目にうっすらハイライト
            ctx.fillStyle = UI.solid ? "rgba(240,138,36,0.10)" : "rgba(255,255,255,0.06)";
            ctx.fillRect(0, 0, S * 2, 1);
            ctx.fillRect(0, S, S * 2, 1);
            ctx.fillRect(0, 0, 1, S * 2);
            ctx.fillRect(S, 0, 1, S * 2);
            bmp._baseTexture.update();
            return bmp;
        }

        makeVignette(w, h) {
            const bmp = new Bitmap(w, h);
            const ctx = bmp.context;
            const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.hypot(w, h) / 2);
            g.addColorStop(0, "rgba(0,0,30,0)");
            g.addColorStop(1, "rgba(0,0,30,0.6)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            bmp._baseTexture.update();
            return bmp;
        }

        update() {
            super.update();
            this._tiling.origin.x -= TT.sx;   // 正の値で右へ流れる
            this._tiling.origin.y -= TT.sy;   // 正の値で下へ流れる
        }
    }

    // ----- ボタン1つ(画像 or 自動生成) -----
    class Sprite_TitleButton extends Sprite {
        initialize(index, command, group) {
            super.initialize();
            const def = TITLE_DEFS[command.symbol] || {};
            this._index = index;
            this._command = command;
            this._group = group;
            this._def = def;
            this._pos = (toNumOrNull(def.x) !== null && toNumOrNull(def.y) !== null)
                ? { x: toNumOrNull(def.x), y: toNumOrNull(def.y) } : null;
            this._label = def.label || command.name;
            this._imgNormal = def.image ? ImageManager.loadSystem(def.image) : null;
            this._imgFocus = def.imageFocus ? ImageManager.loadSystem(def.imageFocus) : null;
            this._imgDisabled = def.imageDisabled ? ImageManager.loadSystem(def.imageDisabled) : null;
            this._built = false;
            this._w = TT.w;
            this._h = TT.h;
            this._age = 0;
            this._focus = 0;
            this._press = 0;
            this._pressTarget = false;
            this._punch = 0;
            this._flash = 0;
            this._shineT = -1;
            this._ripple = -1;
            this._rx = 0;
            this._ry = 0;
            this._wasFocus = false;
            this._baseX = 0;
            this._baseY = 0;
            this._fxDirty = false;
            this.visible = false;
        }

        // 画像の読み込みを待ってから部品を組み立てる
        tryBuild() {
            for (const key of ["_imgNormal", "_imgFocus", "_imgDisabled"]) {
                if (this[key] && this[key].isError()) this[key] = null;   // 読み込み失敗は無視して自動生成へ
            }
            const imgs = [this._imgNormal, this._imgFocus, this._imgDisabled].filter(Boolean);
            if (imgs.every(b => b.isReady())) this.build();
        }

        build() {
            const n = this._imgNormal;
            if (n) {
                this._w = n.width;
                this._h = n.height;
            }
            this._enabled = this._command.enabled;
            this._bmpNormal = n || this.makeGenerated("normal");
            this._bmpFocus = this._imgFocus || (n ? n : this.makeGenerated("focus"));
            this._bmpDisabled = this._imgDisabled || (n ? n : this.makeGenerated("disabled"));
            this._grayDisabled = !!n && !this._imgDisabled;   // 画像のみで無効画像なし→灰色化

            this._base = new Sprite(this._bmpNormal);
            this._base.anchor.set(0.5);
            this._base.setBlendColor([0, 0, 0, 0]);
            this.addChild(this._base);

            if (TT.glow) {
                this._glow = new Sprite(this.makeGlowBitmap(this._bmpFocus));
                this._glow.anchor.set(0.5);
                this._glow.blendMode = 1;   // 加算合成
                this._glow.opacity = 0;
                this.addChild(this._glow);
            }
            if (TT.shine || TT.ripple) {
                this._fx = new Sprite(new Bitmap(this._w, this._h));
                this._fx.anchor.set(0.5);
                this.addChild(this._fx);
            }
            this._shownBitmap = this._bmpNormal;
            this._built = true;
        }

        setCenter(x, y) {
            this._baseX = x;
            this._baseY = y;
            this.x = x;
            this.y = y;
        }

        // ----- 自動生成ボタン -----
        pillPath(ctx, inset) {
            const w = this._w, h = this._h;
            const x0 = inset, y0 = inset, x1 = w - inset, y1 = h - inset;
            const r = (y1 - y0) / 2, cy = (y0 + y1) / 2;
            ctx.beginPath();
            ctx.moveTo(x0 + r, y0);
            ctx.lineTo(x1 - r, y0);
            ctx.arc(x1 - r, cy, r, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(x0 + r, y1);
            ctx.arc(x0 + r, cy, r, Math.PI / 2, Math.PI * 1.5);
            ctx.closePath();
        }

        // ソリッド: 暗いパネル + 面取り + 左のアクセント帯。フォーカスは橙の塗りつぶし
        makeSolid(state) {
            const w = this._w, h = this._h;
            const bmp = new Bitmap(w, h);
            const ctx = bmp.context;
            const focus = state === "focus", dis = state === "disabled";
            uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, {
                c: Math.round(h * 0.3),
                top: focus ? uiShade(UI.accent, 0.1) : dis ? "#171a1f" : UI.base2,
                bottom: focus ? uiShade(UI.accent, -0.38) : dis ? "#0d0f12" : UI.base,
                border: focus ? "#ffe2bc" : dis ? "#3a3f48" : UI.line,
                bw: focus ? 2 : 1.5,
                inner: !focus
            });
            if (!dis) {
                ctx.fillStyle = focus ? "#ffffff" : UI.accent;
                ctx.fillRect(Math.round(h * 0.32), Math.round(h * 0.24), 3, Math.round(h * 0.52));
            }
            if (focus) {
                ctx.beginPath();                                   // ▶(暗い色)
                ctx.moveTo(w - h * 0.62, h / 2 - 6);
                ctx.lineTo(w - h * 0.62, h / 2 + 6);
                ctx.lineTo(w - h * 0.62 + 9, h / 2);
                ctx.closePath();
                ctx.fillStyle = "#1a0d02";
                ctx.fill();
            }
            bmp._baseTexture.update();
            const x0 = h * 0.32 + 14, maxW = w - x0 - h * 0.7;
            bmp.fontFace = uiFace();
            bmp.fontBold = true;
            bmp.fontItalic = false;
            let size = TT.font;
            bmp.fontSize = size;
            while (size > 10 && bmp.measureTextWidth(this._label) > maxW) {
                size--;
                bmp.fontSize = size;
            }
            bmp.textColor = dis ? "#6c717c" : uiTextColor("#ffffff");
            bmp.outlineColor = "rgba(0,0,0,0.9)";
            bmp.outlineWidth = Math.max(2, Math.round(size * 0.16));
            const lh = size + 8;
            bmp.drawText(this._label, x0, (h - lh) / 2, maxW, lh, "center");
            return bmp;
        }

        makeGenerated(state) {
            if (UI.solid) return this.makeSolid(state);
            const w = this._w, h = this._h;
            const bmp = new Bitmap(w, h);
            const ctx = bmp.context;
            const colors = state === "focus" ? [TT.c.f1, TT.c.f2]
                : state === "disabled" ? ["#a3a7b0", "#60646e"] : [TT.c.n1, TT.c.n2];
            // 外枠 → 白い縁 → 本体
            this.pillPath(ctx, 0);
            ctx.fillStyle = "#0d1a36";
            ctx.fill();
            this.pillPath(ctx, 2);
            ctx.fillStyle = "rgba(255,255,255,0.92)";
            ctx.fill();
            this.pillPath(ctx, 3.5);
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, colors[0]);
            g.addColorStop(1, colors[1]);
            ctx.fillStyle = g;
            ctx.fill();
            // 光沢
            ctx.save();
            this.pillPath(ctx, 3.5);
            ctx.clip();
            const gl = ctx.createLinearGradient(0, 0, 0, h * 0.55);
            gl.addColorStop(0, "rgba(255,255,255,0.5)");
            gl.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, w, h * 0.55);
            ctx.restore();
            // フォーカス中は左に矢印
            if (state === "focus") {
                const cy = h / 2;
                ctx.beginPath();
                ctx.moveTo(h * 0.42, cy - 7);
                ctx.lineTo(h * 0.42, cy + 7);
                ctx.lineTo(h * 0.42 + 10, cy);
                ctx.closePath();
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "rgba(10,25,70,0.9)";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
            }
            bmp._baseTexture.update();
            // ラベル
            const maxW = w - h * 1.1;
            bmp.fontFace = uiFace();
            bmp.fontBold = true;
            bmp.fontItalic = false;
            let size = TT.font;
            bmp.fontSize = size;
            while (size > 10 && bmp.measureTextWidth(this._label) > maxW) {
                size--;
                bmp.fontSize = size;
            }
            bmp.textColor = uiTextColor("#ffffff");
            bmp.outlineColor = state === "disabled" ? "rgba(40,42,50,0.95)" : "rgba(10,25,70,0.95)";
            bmp.outlineWidth = Math.max(3, Math.round(size * 0.28));
            const lh = size + 8;
            bmp.drawText(this._label, h * 0.3, (h - lh) / 2, w - h * 0.6, lh, "center");
            return bmp;
        }

        // 画像の輪郭に沿った発光(外側へ滲む)
        makeGlowBitmap(src) {
            const P = 14;
            const bmp = new Bitmap(this._w + P * 2, this._h + P * 2);
            const el = ttElement(src);
            if (!el) return bmp;
            const ctx = bmp.context;
            ctx.save();
            ctx.shadowColor = "rgba(255,238,150,1)";
            ctx.shadowBlur = 14;
            ctx.shadowOffsetX = 10000;   // 本体は画面外へ、影だけを残す
            for (let i = 0; i < 3; i++) {
                ctx.drawImage(el, P - 10000, P, this._w, this._h);
            }
            ctx.restore();
            bmp._baseTexture.update();
            return bmp;
        }

        // ----- 状態の操作 -----
        setPress(v, lx, ly) {
            if (this._pressTarget === v) return;
            this._pressTarget = v;
            if (v && TT.ripple) this.startRipple(lx, ly);
        }

        startRipple(lx, ly) {
            // lx,ly はボタン群(下画面)の座標 → ボタン内座標へ
            this._rx = (lx ?? this._baseX) - (this._baseX - this._w / 2);
            this._ry = (ly ?? this._baseY) - (this._baseY - this._h / 2);
            this._ripple = 0;
        }

        decide() {
            if (TT.decide) {
                this._flash = 1;
                this._punch = 1;
            }
            if (TT.ripple && this._ripple < 0) this.startRipple();
        }

        // ----- 毎フレーム -----
        update() {
            super.update();
            if (!this._built) {
                this.tryBuild();
                return;
            }
            this._age++;
            this._enabled = this._command.enabled;
            this.updateRates();
            this.updateFx();
            this.updateLook();
        }

        updateRates() {
            const g = this._group;
            const focusTarget = this._enabled && g.focusIndex() === this._index;
            if (focusTarget && !this._wasFocus && TT.shine) this._shineT = 0;
            // フォーカス中は一定間隔で光の帯を走らせる
            if (focusTarget && TT.shine && this._shineT < 0 && this._age % 110 === 0) this._shineT = 0;
            this._wasFocus = focusTarget;
            this._focusTarget = focusTarget;
            this._focus = ttApproach(this._focus, focusTarget ? 1 : 0, 0.18);
            this._press = ttApproach(this._press, this._enabled && this._pressTarget ? 1 : 0, 0.3);
            this._punch = Math.max(0, this._punch - 0.07);
            this._flash = Math.max(0, this._flash - 0.06);

            // 登場アニメ(開き始めから順番に)
            let e = 1;
            if (TT.appear) {
                const t = Math.max(0, Math.min(1, (g.openAge() - this._index * 6) / 20));
                e = 1 - Math.pow(1 - t, 3);
            } else {
                e = g.openAge() > 0 ? 1 : 0;
            }
            this._appear = e;

            let s = 1;
            if (TT.pop) s += 0.06 * this._focus;
            if (TT.press) s -= 0.07 * this._press;
            if (TT.decide) s += 0.10 * Math.sin(this._punch * Math.PI);
            this.scale.set(s);

            let bob = 0;
            if (TT.float) bob = Math.sin(this._age / 9) * 2.5 * this._focus;
            this.x = this._baseX + (TT.appear ? 40 * (1 - e) : 0);
            this.y = this._baseY + bob;
            this.alpha = e;
            this.visible = e > 0;
        }

        updateFx() {
            if (!this._fx) return;
            let dirty = false;
            if (this._shineT >= 0) {
                this._shineT += 0.05;
                if (this._shineT >= 1) this._shineT = -1;
                dirty = true;
            }
            if (this._ripple >= 0) {
                this._ripple += 0.045;
                if (this._ripple >= 1) this._ripple = -1;
                dirty = true;
            }
            if (dirty || this._fxDirty) {
                this.drawFx();
                this._fxDirty = dirty;   // 消えた直後にもう一度描いて空にする
            }
        }

        // 光の帯・波紋を描いてから、ボタン画像の輪郭でくり抜く
        drawFx() {
            const bmp = this._fx.bitmap;
            const ctx = bmp.context;
            const w = this._w, h = this._h;
            bmp.clear();
            ctx.save();
            if (this._shineT >= 0) {
                const x = -30 + (w + 60) * this._shineT;
                ctx.save();
                ctx.translate(x, 0);
                ctx.transform(1, 0, -0.45, 1, 0, 0);
                const g = ctx.createLinearGradient(-16, 0, 16, 0);
                g.addColorStop(0, "rgba(255,255,255,0)");
                g.addColorStop(0.5, "rgba(255,255,255,0.65)");
                g.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = g;
                ctx.fillRect(-16, -10, 32, h + 20);
                ctx.restore();
            }
            if (this._ripple >= 0) {
                const t = this._ripple;
                const rad = 6 + Math.max(w, h) * 0.9 * (1 - Math.pow(1 - t, 2));
                const a = 0.85 * (1 - t);
                ctx.beginPath();
                ctx.arc(this._rx, this._ry, rad, 0, Math.PI * 2);
                ctx.lineWidth = 3 + 4 * (1 - t);
                ctx.strokeStyle = "rgba(255,255,255," + a.toFixed(3) + ")";
                ctx.stroke();
                ctx.fillStyle = "rgba(255,255,255," + (a * 0.2).toFixed(3) + ")";
                ctx.fill();
            }
            // 画像の不透明な部分だけ残す
            const el = ttElement(this._base.bitmap);
            if (el) {
                ctx.globalCompositeOperation = "destination-in";
                ctx.drawImage(el, 0, 0, w, h);
            }
            ctx.restore();
            bmp._baseTexture.update();
        }

        updateLook() {
            // 画像の切り替え: 無効 > フォーカス > 通常
            let bmp = this._bmpNormal;
            if (!this._enabled) bmp = this._bmpDisabled;
            else if (this._focusTarget) bmp = this._bmpFocus;
            if (bmp !== this._shownBitmap) {
                this._shownBitmap = bmp;
                this._base.bitmap = bmp;
            }
            // 色味: 決定=白フラッシュ / フォーカス=ほんのり明るく / 押下=暗く
            const white = Math.min(230, this._focus * 20 + this._flash * 190);
            if (white > 0.5) this._base.setBlendColor([255, 255, 255, white]);
            else this._base.setBlendColor([0, 0, 0, this._press * 70]);
            if (!this._enabled && this._grayDisabled) {
                this._base.setColorTone([0, 0, 0, 255]);
                this._base.alpha = 0.6;
            } else {
                this._base.setColorTone([0, 0, 0, 0]);
                this._base.alpha = 1;
            }
            // 発光: フォーカス中はゆっくり脈打つ
            if (this._glow) {
                const pulse = 0.7 + 0.3 * Math.sin(this._age / 6);
                this._glow.opacity = Math.round(255 * this._focus * pulse);
            }
        }
    }

    // ----- ボタン群(入力処理・並べ方)。コマンド処理は元のウィンドウに任せる -----
    class Sprite_TitleButtons extends Sprite {
        initialize(commandWindow) {
            super.initialize();
            this._win = commandWindow;
            this._openAge = 0;
            this._laidOut = false;
            this._pressIdx = -1;
            this._prevHit = -2;
            this._keyGrace = 0;
            this._lastWinIndex = commandWindow.index();
            this._focusOwn = commandWindow.index();
            this._dbgHover = "";
            this._lastX = TouchInput.x;
            this._lastY = TouchInput.y;
            this._buttons = commandWindow._list.map((cmd, i) => {
                const b = new Sprite_TitleButton(i, cmd, this);
                this.addChild(b);
                return b;
            });
            this.hookWindow(commandWindow);
        }

        // 元のウィンドウは見えなくして、操作ロジック(キー・パッド・決定処理)だけ使う
        hookWindow(win) {
            // visible=false にすると、MZ標準の isOpenAndActive() が偽になり、
            // キー/パッド操作や決定が効かなくなるため、透明にして隠す
            win.alpha = 0;
            win.opacity = 0;
            win.contentsOpacity = 0;
            win.processTouch = function() {};   // タッチはボタン側で処理する
            const group = this;
            const baseOk = win.processOk;
            win.processOk = function() {
                const index = this.index();
                const enabled = this.isCurrentItemEnabled();
                baseOk.apply(this, arguments);
                if (enabled) group.onDecide(index);
            };
        }

        focusIndex() {
            return this._focusOwn;
        }

        openAge() {
            return this._openAge;
        }

        onDecide(index) {
            const b = this._buttons[index];
            if (b && b._built) b.decide();
        }

        layout() {
            const auto = this._buttons.filter(b => !b._pos);
            const total = auto.reduce((sum, b) => sum + b._h, 0) + TT.spacing * Math.max(0, auto.length - 1);
            let y = TT.centerY - total / 2;
            for (const b of this._buttons) {
                if (b._pos) {
                    b.setCenter(b._pos.x, b._pos.y);
                } else {
                    b.setCenter(CFG.botW / 2, y + b._h / 2);
                    y += b._h + TT.spacing;
                }
            }
            this._laidOut = true;
        }

        hitIndex(p) {
            for (let i = this._buttons.length - 1; i >= 0; i--) {
                const b = this._buttons[i];
                if (!b._built || !b.visible) continue;
                if (Math.abs(p.x - b._baseX) <= b._w / 2 && Math.abs(p.y - b._baseY) <= b._h / 2) return i;
            }
            return -1;
        }

        update() {
            super.update();
            const win = this._win;
            // ウィンドウの開閉に合わせて表示(開き始めてから登場アニメ)
            const open = win.openness / 255;
            this.alpha = open;
            if (win.openness > 0) this._openAge++;
            if (!this._laidOut && this._buttons.every(b => b._built)) this.layout();
            if (this._laidOut) this.updateInput();
        }

        updateInput() {
            const win = this._win;
            const active = win.active && win.openness >= 255;
            const onBottom = TouchInput.screen() === "bottom";
            const local = TouchInput.localPosition("bottom");
            const hit = (active && onBottom) ? this.hitIndex(local) : -1;
            const trig = TouchInput.isTriggered();

            // ボタンの上に「入った」瞬間を検出(マウスの移動量の判定には頼らない)
            if (this._prevHit === -2) this._prevHit = hit;
            const entered = hit >= 0 && hit !== this._prevHit;
            this._prevHit = hit;

            // キー/パッドによるウィンドウ側の選択変更を取り込む
            if (Input.dir4 !== 0) this._keyGrace = 4;
            else if (this._keyGrace > 0) this._keyGrace--;
            const wi = win.index();
            if (wi !== this._lastWinIndex) {
                this._lastWinIndex = wi;
                if (this._keyGrace > 0) {
                    this._focusOwn = wi;                 // キー/パッドで動いた
                } else if (this._focusOwn >= 0 && wi !== this._focusOwn) {
                    win._index = this._focusOwn;         // 入力なしで勝手に戻された場合は、フォーカスを維持
                    this._lastWinIndex = this._focusOwn;
                }
            }

            // ポインタ: ボタンに入った / 押した → フォーカス
            if (hit >= 0 && (entered || trig) && hit !== this._focusOwn) {
                this._focusOwn = hit;
                if (TT.se) SoundManager.playCursor();
                win.select(hit);                         // キー操作に切り替えたとき、この位置から続けられるように
                this._lastWinIndex = win.index();
            }
            this._dbgHover = "own:" + this._focusOwn + " hit:" + hit + " ent:" + entered +
                " wi:" + wi + " key:" + this._keyGrace;

            // 押し始め
            if (hit >= 0 && trig && this._pressIdx < 0) {
                this._pressIdx = hit;
                this._focusOwn = hit;
                this._buttons[hit].setPress(true, local.x, local.y);
            }
            // 押している間 / 離したとき
            if (this._pressIdx >= 0) {
                const b = this._buttons[this._pressIdx];
                if (active && TouchInput.isPressed()) {
                    b.setPress(hit === this._pressIdx);
                } else {
                    b.setPress(false);
                    if (active && hit === this._pressIdx) this.activateButton(b);
                    this._pressIdx = -1;
                }
            }
        }

        activateButton(button) {
            const win = this._win;
            win._index = button._index;        // select() の結果に依存せず、確実にこのボタンを対象にする
            win.select(button._index);
            if (button._command.enabled) {
                win.processOk();   // 決定音・ハンドラ呼び出し・決定演出まで元の処理に任せる
            } else {
                SoundManager.playBuzzer();
            }
        }
    }

    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if (!TT.enabled) return;
        // 下画面の背景(下画面背景の上・ピクチャ層の下)
        this._titleBottomBg = new Sprite_TitleBottomBackground();
        this.addChildAt(this._titleBottomBg, this.getChildIndex(this._bottomPictureLayer));
        // 画像ボタン(ウィンドウ層の直下)
        this._titleButtons = new Sprite_TitleButtons(this._commandWindow);
        this._titleButtons.x = CFG.botX;
        this._titleButtons.y = CFG.botY;
        this.addChildAt(this._titleButtons, this.getChildIndex(this._bottomWindowLayer));
    };

    //-------------------------------------------------------------------------
    // デバッグ: 入力情報の表示(不具合調査用)
    //-------------------------------------------------------------------------
    if (prm.debugInput === "true") {
        const rawMouse = { px: -1, py: -1, cx: -1, cy: -1, n: 0 };
        document.addEventListener("mousemove", e => {
            rawMouse.px = e.pageX;
            rawMouse.py = e.pageY;
            rawMouse.cx = Graphics.pageToCanvasX(e.pageX);
            rawMouse.cy = Graphics.pageToCanvasY(e.pageY);
            rawMouse.n++;
        });
        const _Scene_Base_update_dbg = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update_dbg.apply(this, arguments);
            this.updateInputDebug();
        };
        Scene_Base.prototype.updateInputDebug = function() {
            const w = CFG.botW, h = 84;
            if (!this._inputDebug) {
                this._inputDebug = new Sprite(new Bitmap(w, h));
                this._inputDebug.x = CFG.botX;
                this._inputDebug.y = CFG.botY + CFG.botH - h;
                this._inputDebugText = "";
            }
            if (this._inputDebug.parent !== this) this.addChild(this._inputDebug);   // 常に最前面
            const tx = TouchInput.x, ty = TouchInput.y;
            const lines = [
                "raw page:" + rawMouse.px + "," + rawMouse.py + " canvas:" + rawMouse.cx + "," + rawMouse.cy + " n:" + rawMouse.n,
                "Touch:" + tx + "," + ty + " scr:" + TouchInput.screen() + " in:" + Graphics.isInsideCanvas(tx, ty),
                "press:" + TouchInput.isPressed() + " trig:" + TouchInput.isTriggered() + " scale:" + Graphics._realScale
            ];
            const g = this._titleButtons;
            if (g) {
                const win = g._win;
                const local = TouchInput.localPosition("bottom");
                lines.push("win act:" + win.active + " open:" + win.openness + " idx:" + win.index() +
                    " hit:" + g.hitIndex(local) + " laid:" + g._laidOut);
                lines.push(g._dbgHover);
            }
            const text = lines.join("\n");
            if (text !== this._inputDebugText) {
                this._inputDebugText = text;
                const bmp = this._inputDebug.bitmap;
                bmp.clear();
                bmp.fillRect(0, 0, w, h, "rgba(0,0,0,0.65)");
                bmp.fontSize = 11;
                bmp.textColor = "#9dff9d";
                bmp.outlineWidth = 0;
                lines.forEach((l, i) => bmp.drawText(l, 3, i * 14, w - 6, 14, "left"));
            }
        };
    }

    //=========================================================================
    // 戦闘後リザルト(勝利): 上画面=パーティの経験値ゲージ / 下画面=獲得報酬
    //=========================================================================
    const RS = {
        enabled: prm.resultEnabled !== "false",
        titleText: (prm.resultTitleText ?? "VICTORY!"),
        topImage: prm.resultTopImage || "",
        topBack: uiTheme(prm.resultTopBackColor, "#0b1d3f", "#0d0f13"),
        botImage: prm.resultBottomImage || "",
        botBack: uiTheme(prm.resultBottomBackColor, "#0b1d3f", "#0d0f13"),
        checker: prm.resultBgChecker !== "false",
        cardBg: prm.resultCardBgEnabled !== "false",
        panelBg: prm.resultPanelBgEnabled !== "false",
        dim: prm.resultDimColor || "rgba(0,0,0,0.35)",
        fill: Math.max(1, Number(prm.resultGaugeFrames || 70)),
        g1: uiTheme(prm.resultGaugeColor1, "#58d0ff", "#ffb455"),
        g2: uiTheme(prm.resultGaugeColor2, "#1c6fb4", "#e0701c"),
        gBack: uiTheme(prm.resultGaugeBackColor, "rgba(0,0,0,0.55)", "rgba(0,0,0,0.8)"),
        lvText: (prm.resultLevelUpText ?? "LEVEL UP!"),
        se: {
            name: prm.resultLevelUpSe || "",
            volume: Number(prm.resultLevelUpSeVolume ?? 90),
            pitch: Number(prm.resultLevelUpSePitch ?? 100),
            pan: Number(prm.resultLevelUpSePan ?? 0)
        },
        getLabel: (prm.resultGetLabel ?? "GET!"),
        expLabel: (prm.resultExpLabel ?? "EXP"),
        goldLabel: (prm.resultGoldLabel ?? "GOLD"),
        itemLabel: (prm.resultItemLabel ?? "ITEM"),
        noItem: (prm.resultNoItemText ?? "- なし -"),
        hint: (prm.resultContinueHint ?? "つぎへ"),
        minWait: Math.max(0, Number(prm.resultMinWait ?? 20))
    };
    // 旧プラグインが有効なままだと、勝利処理が二重に置き換わって競合する
    if (window.$plugins && $plugins.some(p => p.name === "DualScreen3DS_BattleResult" && p.status)) {
        console.warn("[DualScreen3DS] 旧プラグイン DualScreen3DS_BattleResult.js が有効です。" +
            "リザルトは本体に統合済みなので、プラグイン管理でOFFにしてください。");
    }
    const rsImageDefs = key => parseJson(prm[key], []).map(str => parseJson(str, null)).filter(d => d && d.image);
    const RS_TOP_IMAGES = rsImageDefs("resultTopImages");
    const RS_BOTTOM_IMAGES = rsImageDefs("resultBottomImages");

    // ---- 小道具 ----
    const rsRoundRect = (ctx, x, y, w, h, r) => {
        if (UI.solid) { uiChamfer(ctx, x, y, w, h, Math.max(1.5, Math.min(7, r * 0.55))); return; }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    };
    const rsText = (bmp, text, x, y, w, size, align = "left", color = "#ffffff", outline = "rgba(10,25,70,0.95)") => {
        if (UI.solid && !/,\s*0(\.0+)?\)$/.test(outline)) outline = "rgba(0,0,0,0.9)";
        const st = uiStyleOf(uiCat);
        if (st.color && /^#(fff|ffffff)$/i.test(color)) color = st.color;                          // 白い文字を指定色に
        if (st.outline && !/,\s*0(\.0+)?\)$/.test(outline)) outline = st.outline;
        if (st.scale !== 1) size = Math.max(6, Math.round(size * st.scale));
        bmp.fontFace = uiFace();
        bmp.fontBold = true;
        bmp.fontItalic = false;
        bmp.fontSize = size;
        bmp.textColor = color;
        bmp.outlineColor = outline;
        bmp.outlineWidth = Math.max(2, Math.round(size * 0.2));
        bmp.drawText(String(text), x, y, w, size + 6, align);
    };
    // グラデーション文字(見出し用)
    const rsGradText = (bmp, text, cx, cy, size, c1, c2, stroke, strokeWidth) => {
        const st = uiStyleOf(uiCat);
        if (st.color) { c1 = st.color; c2 = st.color; }
        if (st.scale !== 1) size = Math.round(size * st.scale);
        const ctx = bmp.context;
        ctx.save();
        ctx.font = "bold " + size + "px " + uiFace();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = UI.solid ? "rgba(0,0,0,0.9)" : stroke;
        ctx.strokeText(text, cx, cy);
        const g = ctx.createLinearGradient(0, cy - size / 2, 0, cy + size / 2);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        ctx.fillStyle = g;
        ctx.fillText(text, cx, cy);
        ctx.restore();
    };
    const rsStar = (ctx, cx, cy, r, color) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(cx, cy, cx + r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + r);
        ctx.quadraticCurveTo(cx, cy, cx - r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - r);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    };
    const rsEase = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    const rsClamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rsNum = (v, d) => (v === undefined || v === null || safeTrim(v) === "" || isNaN(Number(v))) ? d : Number(v);

    const rsLevelAtExp = (actor, exp, lo, hi) => {
        let lv = lo;
        while (lv < hi && exp >= actor.expForLevel(lv + 1)) lv++;
        return lv;
    };
    const rsGaugeRatio = (actor, level, exp) => {
        if (level >= actor.maxLevel()) return 1;
        const cur = actor.expForLevel(level);
        const next = actor.expForLevel(level + 1);
        return next > cur ? rsClamp((exp - cur) / (next - cur), 0, 1) : 1;
    };
    // ---- UI部品の画像(スキン) ----
    // rsSkin(key): 画像あり→Bitmap / 読み込み中→null(描かない) / 未指定or失敗→undefined(自動で描く)
    let rsImgVer = 0;           // 画像の読み込みが終わるたびに増える(各部品が描き直しの合図に使う)
    const rsImgCache = {};
    const rsSkin = key => {
        if (!(key in rsImgCache)) {
            const name = prm[key] || "";
            if (name) {
                const b = ImageManager.loadSystem(name);
                b.addLoadListener(() => { rsImgVer++; });
                rsImgCache[key] = b;
            } else {
                rsImgCache[key] = null;
            }
        }
        const b = rsImgCache[key];
        if (!b) return undefined;
        if (b.isError()) return undefined;
        return b.isReady() && b.width > 0 ? b : null;
    };
    const rsBlit = (bmp, img, x, y, w, h) => bmp.blt(img, 0, 0, img.width, img.height, x, y, w, h);
    const rsPlayLevelUpSe = () => {
        if (RS.se.name) AudioManager.playSe({ name: RS.se.name, volume: RS.se.volume, pitch: RS.se.pitch, pan: RS.se.pan });
        else SoundManager.playRecovery();
    };
    const rsDrawIcon = (bmp, iconIndex, x, y, size) => {
        const sheet = ImageManager.loadSystem("IconSet");
        if (!sheet.isReady() || sheet.width <= 0) return false;
        bmp.blt(sheet, (iconIndex % 16) * 32, Math.floor(iconIndex / 16) * 32, 32, 32, x, y, size, size);
        return true;
    };

    // ---- 戦闘処理: 勝利時にリザルトを出す ----
    const _BM_processVictory_rs = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        if (!RS.enabled) return _BM_processVictory_rs.call(this);
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();

        const members = ($gameParty.wheelMembers ? $gameParty.wheelMembers() : $gameParty.allMembers()).slice(0, 6);
        const before = members.map(a => ({ level: a.level, exp: a.currentExp() }));
        const front = $gameParty.battleMembers();
        // ドロップを種類ごとにまとめる(gainRewards の前に控える)
        const counts = new Map();
        for (const item of this._rewards.items) counts.set(item, (counts.get(item) || 0) + 1);
        this.gainRewards();
        const after = members.map(a => ({ level: a.level, exp: a.currentExp() }));

        this._dsResult = {
            exp: this._rewards.exp,
            gold: this._rewards.gold,
            items: Array.from(counts, ([item, count]) => ({ item, count })),
            entries: members.map((actor, i) => ({
                actor,
                front: front.includes(actor),
                beforeLevel: before[i].level,
                beforeExp: before[i].exp,
                afterLevel: after[i].level,
                afterExp: after[i].exp
            }))
        };
        this._dsResultActive = true;
        this.endBattle(0);
    };

    const _BM_isBusy_rs = BattleManager.isBusy;
    BattleManager.isBusy = function() {
        return !!this._dsResultActive || _BM_isBusy_rs.call(this);
    };

    const _Scene_Battle_update_rs = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update_rs.apply(this, arguments);
        if (BattleManager._dsResult && !this._dsResultSprite) {
            const data = BattleManager._dsResult;
            BattleManager._dsResult = null;
            const sprite = new Sprite_BattleResult(data, () => {
                this._dsResultSprite = null;
                BattleManager._dsResultActive = false;
            });
            this.addChild(sprite);
            this._dsResultSprite = sprite;
        }
    };

    // ---- 重ねる画像(位置/拡大/合成/出現/動き/敷き詰め) ----
    class Sprite_RsDecor extends Sprite {
        initialize(def, w, h) {
            super.initialize();
            this._age = 0;
            this._tile = def.tile === "true";
            this._appear = def.appear || "fade";
            this._delay = rsNum(def.appearDelay, 0);
            this._frames = Math.max(1, rsNum(def.appearFrames, 20));
            this._motion = def.motion || "none";
            this._speed = rsNum(def.motionSpeed, 1);
            this._amount = rsNum(def.motionAmount, 6);
            this._opacity = rsClamp(rsNum(def.opacity, 255), 0, 255);
            this._scale = Math.max(0.01, rsNum(def.scale, 100) / 100);
            this._sx = rsNum(def.scrollX, 0);
            this._sy = rsNum(def.scrollY, 0);
            this._baseX = rsNum(def.x, 0);
            this._baseY = rsNum(def.y, 0);
            const bmp = def.folder === "pictures" ? ImageManager.loadPicture(def.image) : ImageManager.loadSystem(def.image);
            const blendMap = { normal: 0, add: 1, multiply: 2, screen: 3 };
            this._blend = blendMap[def.blend] ?? 0;
            if (this._tile) {
                this._img = new TilingSprite(bmp);
                this._img.move(0, 0, w, h);
                if (this._img.tileScale) this._img.tileScale.set(this._scale);
            } else {
                this._img = new Sprite(bmp);
                if (def.origin === "center") this._img.anchor.set(0.5);
                this._img.scale.set(this._scale);
            }
            this._img.blendMode = this._blend;
            this.addChild(this._img);
            this.updateLook();
        }

        update() {
            super.update();
            this._age++;
            if (this._tile) {
                this._img.origin.x -= this._sx;
                this._img.origin.y -= this._sy;
            }
            this.updateLook();
        }

        updateLook() {
            const t = rsEase((this._age - this._delay) / this._frames);
            const inv = 1 - t;
            let ox = 0, oy = 0, sc = 1, a = 1;
            switch (this._appear) {
                case "fade": a = t; break;
                case "slideLeft": ox = -80 * inv; a = t; break;
                case "slideRight": ox = 80 * inv; a = t; break;
                case "slideUp": oy = -60 * inv; a = t; break;
                case "slideDown": oy = 60 * inv; a = t; break;
                case "zoom": sc = 0.4 + 0.6 * t; a = t; break;
                default: a = this._age >= this._delay ? 1 : 0;
            }
            let rot = 0;
            const ph = this._age * 0.05 * this._speed;
            if (!this._tile) {
                switch (this._motion) {
                    case "float": oy += Math.sin(ph) * this._amount; break;
                    case "sway": rot = Math.sin(ph) * this._amount * Math.PI / 180; break;
                    case "pulse": sc *= 1 + Math.sin(ph) * this._amount / 100; break;
                    case "spin": rot = this._age * 0.02 * this._speed; break;
                }
                this._img.x = this._baseX + ox;
                this._img.y = this._baseY + oy;
                this._img.rotation = rot;
                this._img.scale.set(this._scale * sc);
            }
            this._img.opacity = Math.round(this._opacity * a);
        }
    }

    // ---- 1画面ぶんの土台(背景 / チェック柄 / 奥の画像 / 内容 / 手前の画像) ----
    class Sprite_RsScreen extends Sprite {
        initialize(w, h, backColor, imageName, decorDefs) {
            super.initialize();
            this._w = w;
            this._h = h;
            if (window.PIXI && PIXI.Graphics && PIXI.Graphics.prototype.isFastRect) {
                const g = new PIXI.Graphics();
                g.beginFill(0xffffff);
                g.drawRect(0, 0, w, h);
                g.endFill();
                this.addChild(g);
                this.mask = g;
            }
            // 背景(単色+光のグラデーション / 画像)
            this._bgBmp = new Bitmap(w, h);
            this._bgImage = imageName ? ImageManager.loadSystem(imageName) : null;
            this._backColor = backColor;
            this.paintBackground();
            if (this._bgImage) this._bgImage.addLoadListener(() => this.paintBackground());
            this.addChild(new Sprite(this._bgBmp));

            if (RS.checker) {
                const tile = new Bitmap(64, 64);
                const tc = UI.solid ? "rgba(240,138,36,0.05)" : "rgba(255,255,255,0.07)";
                tile.fillRect(0, 0, 32, 32, tc);
                tile.fillRect(32, 32, 32, 32, tc);
                this._checker = new TilingSprite(tile);
                this._checker.move(0, 0, w, h);
                this.addChild(this._checker);
            }
            this._back = new Sprite();
            this.addChild(this._back);
            this.content = new Sprite();
            this.addChild(this.content);
            this._front = new Sprite();
            this.addChild(this._front);
            for (const def of decorDefs) {
                const d = new Sprite_RsDecor(def, w, h);
                (def.layer === "front" ? this._front : this._back).addChild(d);
            }
        }

        paintBackground() {
            const bmp = this._bgBmp, ctx = bmp.context, w = this._w, h = this._h;
            bmp.clear();
            bmp.fillRect(0, 0, w, h, this._backColor);
            if (this._bgImage && this._bgImage.width > 0) {
                bmp.blt(this._bgImage, 0, 0, this._bgImage.width, this._bgImage.height, 0, 0, w, h);
            } else if (UI.solid) {
                // ソリッド: 暗い面 + 走査線 + 上下のアクセント線 + 四隅の暗がり
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, "rgba(255,255,255,0.05)");
                g.addColorStop(1, "rgba(0,0,0,0.3)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "rgba(0,0,0,0.18)";
                for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
                const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) / 2);
                v.addColorStop(0, "rgba(0,0,0,0)");
                v.addColorStop(1, "rgba(0,0,0,0.55)");
                ctx.fillStyle = v;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = UI.accent;
                ctx.fillRect(0, 0, w, 2);
                ctx.fillRect(0, h - 2, w, 2);
            } else {
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, "rgba(255,255,255,0.18)");
                g.addColorStop(0.5, "rgba(255,255,255,0.02)");
                g.addColorStop(1, "rgba(0,0,0,0.35)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) / 2);
                v.addColorStop(0, "rgba(0,0,0,0)");
                v.addColorStop(1, "rgba(0,0,20,0.55)");
                ctx.fillStyle = v;
                ctx.fillRect(0, 0, w, h);
            }
            bmp._baseTexture.update();
        }

        update() {
            super.update();
            if (this._checker) {
                this._checker.origin.x -= 0.35;
                this._checker.origin.y -= 0.35;
            }
        }
    }

    // ---- 見出しリボン(VICTORY!) ----
    class Sprite_RsBanner extends Sprite {
        initialize(w, text) {
            super.initialize(new Bitmap(w, 40));
            this._w = w;
            this._text = text;
            this._age = 0;
            this._shine = -1;
            this._imgVer = -1;
            this.anchor.set(0.5, 0.5);
            this.x = w / 2;
            this.y = 22;
            this.draw(-1);
        }

        draw(shine) {
            const bmp = this.bitmap, ctx = bmp.context, w = this._w, h = 40;
            bmp.clear();
            const skin = rsSkin("resultBannerImage");
            if (skin) {
                rsBlit(bmp, skin, 0, 0, w, h);                 // 画像(伸縮)
            } else if (skin === undefined) {
                ctx.save();                                    // 自動のリボン
                const rg = ctx.createLinearGradient(0, 4, 0, h - 4);
                rg.addColorStop(0, UI.solid ? "rgba(26,29,36,0.95)" : "rgba(40,90,200,0.92)");
                rg.addColorStop(1, UI.solid ? "rgba(7,8,10,0.95)" : "rgba(14,34,96,0.92)");
                ctx.fillStyle = rg;
                ctx.fillRect(0, 6, w, h - 12);
                ctx.fillStyle = UI.solid ? UI.accent : "#ffe36a";
                ctx.fillRect(0, 6, w, 2);
                ctx.fillRect(0, h - 8, w, 2);
                ctx.restore();
            }
            if (shine >= 0 && skin !== null) {                 // 光の帯(帯の上を走る)
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 6, w, h - 12);
                ctx.clip();
                ctx.translate(-60 + (w + 120) * shine, 0);
                ctx.transform(1, 0, -0.45, 1, 0, 0);
                const sg = ctx.createLinearGradient(-30, 0, 30, 0);
                sg.addColorStop(0, "rgba(255,255,255,0)");
                sg.addColorStop(0.5, "rgba(255,255,255,0.6)");
                sg.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = sg;
                ctx.fillRect(-30, 0, 60, h);
                ctx.restore();
            }
            if (this._text) rsGradText(bmp, this._text, w / 2, h / 2 + 1, 26, UI.solid ? "#ffffff" : "#fff7c0", UI.solid ? "#f6a24a" : "#ffb52a", "rgba(60,25,0,0.95)", 5);
            bmp._baseTexture.update();
        }

        update() {
            super.update();
            this._age++;
            const t = rsEase(this._age / 16);
            this.scale.set(2.2 - 1.2 * t);
            this.opacity = Math.round(255 * t);
            const shineT = (this._age - 16) / 36;
            const shine = shineT >= 0 && shineT <= 1 ? shineT : -1;
            if (shine !== this._shine || this._imgVer !== rsImgVer) {
                this._shine = shine;
                this._imgVer = rsImgVer;
                this.draw(shine);
            }
        }
    }

    // ---- 1人ぶんのカード(顔 / 名前 / Lv / 経験値ゲージ) ----
    class Sprite_RsCard extends Sprite {
        initialize(entry, slot, w, h) {
            super.initialize(new Bitmap(w, h));
            this._entry = entry || null;
            this._slot = slot;
            this._w = w;
            this._h = h;
            this._age = 0;
            this._delay = 20 + slot * 7;           // 登場の順番
            this._fillStart = this._delay + 18;      // ゲージが伸び始める時刻
            this._curExp = entry ? entry.beforeExp : 0;
            this._lastLevel = entry ? entry.beforeLevel : 0;
            this._leveled = false;
            this._flash = 0;
            this._pop = 0;
            this._sparks = [];
            this._skipped = false;
            this._face = null;
            this._dirty = true;
            this._imgVer = -1;
            this.anchor.set(0.5);
            this.opacity = 0;
            if (entry) {
                this._face = ImageManager.loadFace(entry.actor.faceName());
                this._face.addLoadListener(() => { this._dirty = true; });
            }
        }

        isDone() {
            return !this._entry || this._skipped || this._age >= this._fillStart + RS.fill;
        }

        skip() {
            if (this.isDone() && this._skipped) return;
            this._skipped = true;
            if (this._entry) {
                this._curExp = this._entry.afterExp;
                this._lastLevel = this._entry.afterLevel;
                this._leveled = this._entry.afterLevel > this._entry.beforeLevel;
            }
            this._sparks = [];
            this._flash = 0;
            this._dirty = true;
        }

        update() {
            super.update();
            this._age++;
            if (this._imgVer !== rsImgVer) { this._imgVer = rsImgVer; this._dirty = true; }
            // 登場(ポンと弾みながら)
            const t = rsClamp((this._age - this._delay) / 14, 0, 1);
            const e = rsEase(t);
            const back = t < 1 ? Math.sin(t * Math.PI) * 0.08 : 0;
            this.scale.set(0.6 + 0.4 * e + back);
            this.opacity = Math.round(255 * e);
            if (t < 1) this._dirty = true;

            const entry = this._entry;
            if (entry && !this._skipped && this._age >= this._fillStart && this._age < this._fillStart + RS.fill) {
                const p = (this._age - this._fillStart) / RS.fill;
                this._curExp = entry.beforeExp + (entry.afterExp - entry.beforeExp) * (1 - Math.pow(1 - p, 2));
                const lv = rsLevelAtExp(entry.actor, this._curExp, entry.beforeLevel, entry.afterLevel);
                if (lv > this._lastLevel) {
                    this._lastLevel = lv;
                    this._leveled = true;
                    this._flash = 1;
                    this._pop = 1;
                    this.burst();
                    rsPlayLevelUpSe();
                }
                this._dirty = true;
            } else if (entry && !this._skipped && this._age === this._fillStart + RS.fill) {
                this._curExp = entry.afterExp;
                this._dirty = true;
            }
            if (this._flash > 0) { this._flash = Math.max(0, this._flash - 0.04); this._dirty = true; }
            if (this._pop > 0) { this._pop = Math.max(0, this._pop - 0.05); this._dirty = true; }
            if (this._sparks.length > 0) {
                for (const sp of this._sparks) { sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.08; sp.life--; }
                this._sparks = this._sparks.filter(sp => sp.life > 0);
                this._dirty = true;
            }
            if (this._leveled && this._age % 3 === 0) this._dirty = true;   // 「LEVEL UP!」リボンの脈動
            if (this._dirty) this.refresh();
        }

        burst() {
            const cx = this._w - 14, cy = this._h - 20;
            for (let i = 0; i < 16; i++) {
                const a = Math.random() * Math.PI * 2, sp = 0.8 + Math.random() * 2.2;
                this._sparks.push({
                    x: cx - Math.random() * (this._w - 30), y: cy, vx: Math.cos(a) * sp * 0.6, vy: -Math.abs(Math.sin(a)) * sp - 0.6,
                    life: 26 + Math.floor(Math.random() * 16), r: 2 + Math.random() * 2.5
                });
            }
        }

        // カードの台座(画像 > 自動で描く(ON時) > 描かない)
        drawBase(bmp, ctx, w, h, entry, front) {
            const key = !entry ? "resultCardEmptyImage"
                : front ? "resultCardImage" : (prm.resultCardImageBack ? "resultCardImageBack" : "resultCardImage");
            const skin = rsSkin(key);
            if (skin) { rsBlit(bmp, skin, 0, 0, w, h); return; }
            if (skin === null || !RS.cardBg) return;           // 読み込み中 / 背景なし
            if (UI.solid) {
                // ソリッド: 前衛=橙の枠 / 後衛=灰色の枠 / 空き枠=暗い枠
                uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, {
                    c: 8,
                    top: entry ? UI.base2 : "#14161b",
                    bottom: UI.base,
                    border: !entry ? "#3a3f48" : front ? UI.accent : "#6d7480",
                    bw: this._flash > 0 ? 2.5 : 1.5
                });
                if (this._flash > 0) {
                    uiChamfer(ctx, 0.5, 0.5, w - 1, h - 1, 8);
                    ctx.fillStyle = "rgba(255,200,120," + (0.25 * this._flash).toFixed(2) + ")";
                    ctx.fill();
                }
                return;
            }
            rsRoundRect(ctx, 0, 0, w, h, 10);
            ctx.fillStyle = "#0d1a36";
            ctx.fill();
            rsRoundRect(ctx, 1.5, 1.5, w - 3, h - 3, 9);
            ctx.fillStyle = this._flash > 0 ? "rgba(255,240,150,1)" : "rgba(255,255,255,0.9)";
            ctx.fill();
            rsRoundRect(ctx, 3, 3, w - 6, h - 6, 8);
            const g = ctx.createLinearGradient(0, 0, 0, h);
            if (!entry) { g.addColorStop(0, "#39405e"); g.addColorStop(1, "#1e2238"); }
            else if (front) { g.addColorStop(0, "#3d73d6"); g.addColorStop(1, "#16307a"); }
            else { g.addColorStop(0, "#5d6490"); g.addColorStop(1, "#272b4c"); }
            ctx.fillStyle = g;
            ctx.fill();
            ctx.save();
            rsRoundRect(ctx, 3, 3, w - 6, h - 6, 8);
            ctx.clip();
            const gl = ctx.createLinearGradient(0, 3, 0, h * 0.5);
            gl.addColorStop(0, "rgba(255,255,255,0.28)");
            gl.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, w, h * 0.5);
            ctx.restore();
        }

        refresh() {
            this._dirty = false;
            const bmp = this.bitmap, ctx = bmp.context, w = this._w, h = this._h;
            bmp.clear();
            const entry = this._entry;
            const front = entry ? entry.front : false;
            this.drawBase(bmp, ctx, w, h, entry, front);
            bmp._baseTexture.update();
            if (!entry) {
                if (RS.cardBg || prm.resultCardEmptyImage) rsText(bmp, "---", 0, h / 2 - 11, w, 16, "center", "#8a90b0", "rgba(0,0,20,0.8)");
                return;
            }
            const actor = entry.actor;

            // 顔(枠は画像 > 自動)
            const fx = 7, fy = 8, fs = 50;
            ctx.save();
            rsRoundRect(ctx, fx, fy, fs, fs, 8);
            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.fill();
            ctx.clip();
            if (this._face && this._face.isReady() && this._face.width > 0) {
                const idx = actor.faceIndex();
                ctx.drawImage(ttElement(this._face), (idx % 4) * 144, Math.floor(idx / 4) * 144, 144, 144, fx, fy, fs, fs);
            }
            ctx.restore();
            const frameSkin = rsSkin("resultFaceFrameImage");
            if (frameSkin) {
                rsBlit(bmp, frameSkin, fx, fy, fs, fs);
            } else if (frameSkin === undefined) {
                rsRoundRect(ctx, fx, fy, fs, fs, 8);
                ctx.strokeStyle = "rgba(255,255,255,0.9)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            // 前衛/後衛のチップ(画像 > 自動)
            const chipSkin = rsSkin(front ? "resultChipFrontImage" : "resultChipBackImage");
            if (chipSkin) {
                rsBlit(bmp, chipSkin, fx + 2, fy + fs - 14, 20, 12);
            } else if (chipSkin === undefined) {
                rsRoundRect(ctx, fx + 2, fy + fs - 14, 20, 12, 5);
                ctx.fillStyle = front ? "#ffcf3a" : "#aab2d4";
                ctx.fill();
                bmp._baseTexture.update();
                rsText(bmp, front ? "前" : "後", fx + 2, fy + fs - 18, 20, 9, "center", "#2a1a00", "rgba(255,255,255,0.0)");
            }
            bmp._baseTexture.update();

            // 名前 / Lv
            const tx = fx + fs + 6, tw = w - tx - 6;
            rsText(bmp, actor.name(), tx, 5, tw, 13, "left");
            const lv = rsLevelAtExp(actor, this._curExp, entry.beforeLevel, entry.afterLevel);
            rsText(bmp, "Lv", tx, 25, 18, 10, "left", "#ffe9a0", "rgba(60,30,0,0.9)");
            const numSize = 22 + Math.round(8 * Math.sin(this._pop * Math.PI));
            rsText(bmp, lv, tx + 14, 20 - Math.round((numSize - 22) / 2), 44, numSize, "left", this._flash > 0 ? "#ffe36a" : "#ffffff");
            // 獲得経験値
            const gained = Math.max(0, Math.floor(this._curExp - entry.beforeExp));
            rsText(bmp, "+" + gained, tx, 46, tw, 11, "left", "#9dff9d", "rgba(0,40,0,0.9)");

            // 経験値ゲージ(背景/中身/枠 それぞれ 画像 > 自動)
            const gx = 7, gy = h - 19, gw = w - 14, gh = 12;
            const lvNow = lv;
            const ratio = rsGaugeRatio(actor, lvNow, this._curExp);
            const backSkin = rsSkin("resultGaugeBackImage");
            if (backSkin) {
                rsBlit(bmp, backSkin, gx, gy, gw, gh);
            } else if (backSkin === undefined) {
                ctx.fillStyle = RS.gBack;
                rsRoundRect(ctx, gx, gy, gw, gh, 6);
                ctx.fill();
            }
            const fillSkin = rsSkin("resultGaugeFillImage");
            if (ratio > 0) {
                if (fillSkin) {
                    // 割合ぶんだけ、画像を左から切り取って表示
                    const sw = Math.max(1, Math.round(fillSkin.width * ratio));
                    bmp.blt(fillSkin, 0, 0, sw, fillSkin.height, gx, gy, Math.max(1, Math.round(gw * ratio)), gh);
                } else if (fillSkin === undefined) {
                    ctx.save();
                    rsRoundRect(ctx, gx, gy, Math.max(gh, gw * ratio), gh, 6);
                    ctx.clip();
                    const gg = ctx.createLinearGradient(gx, 0, gx + gw, 0);
                    gg.addColorStop(0, RS.g2);
                    gg.addColorStop(1, RS.g1);
                    ctx.fillStyle = gg;
                    ctx.fillRect(gx, gy, gw, gh);
                    const hl = ctx.createLinearGradient(0, gy, 0, gy + gh);
                    hl.addColorStop(0, UI.solid ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.55)");
                    hl.addColorStop(0.5, "rgba(255,255,255,0.03)");
                    hl.addColorStop(1, "rgba(0,0,0,0.2)");
                    ctx.fillStyle = hl;
                    ctx.fillRect(gx, gy, gw, gh);
                    // 流れる光
                    const sx = gx + ((this._age * 2.2) % (gw + 40)) - 20;
                    const sg = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0);
                    sg.addColorStop(0, "rgba(255,255,255,0)");
                    sg.addColorStop(0.5, "rgba(255,255,255,0.45)");
                    sg.addColorStop(1, "rgba(255,255,255,0)");
                    ctx.fillStyle = sg;
                    ctx.fillRect(sx - 14, gy, 28, gh);
                    ctx.restore();
                }
            }
            const frameG = rsSkin("resultGaugeFrameImage");
            if (frameG) {
                rsBlit(bmp, frameG, gx, gy, gw, gh);
            } else if (frameG === undefined && backSkin === undefined && fillSkin === undefined) {
                ctx.fillStyle = "rgba(255,255,255,0.28)";
                for (let k = 1; k < 4; k++) ctx.fillRect(Math.round(gx + gw * k / 4), gy + 2, 1, gh - 4);
                ctx.strokeStyle = "rgba(255,255,255,0.55)";
                ctx.lineWidth = 1;
                rsRoundRect(ctx, gx + 0.5, gy + 0.5, gw - 1, gh - 1, 6);
                ctx.stroke();
            }
            if (this._flash > 0) {
                rsRoundRect(ctx, gx, gy, gw, gh, 6);
                ctx.fillStyle = "rgba(255,255,255," + (0.7 * this._flash).toFixed(2) + ")";
                ctx.fill();
            }
            bmp._baseTexture.update();
            const maxLv = actor.maxLevel();
            const nextTxt = lvNow >= maxLv ? "MAX" : "NEXT " + Math.max(0, Math.ceil(actor.expForLevel(lvNow + 1) - this._curExp));
            rsText(bmp, "EXP", gx, gy - 13, 30, 9, "left", "#bfe6ff", "rgba(0,20,60,0.9)");
            rsText(bmp, nextTxt, gx, gy - 13, gw, 9, "right", "#ffffff");

            // LEVEL UP!(リボンは 画像 > 自動。文字は上に重ねる)
            if (this._leveled) {
                const pulse = 0.5 + 0.5 * Math.sin(this._age / 4);
                const rw = 54, rh = 14, rx = w - rw - 6, ry = 6;
                const lvSkin = rsSkin("resultLevelUpImage");
                if (lvSkin) {
                    rsBlit(bmp, lvSkin, rx, ry, rw, rh);
                } else if (lvSkin === undefined) {
                    rsRoundRect(ctx, rx, ry, rw, rh, 7);
                    const rg = ctx.createLinearGradient(0, ry, 0, ry + rh);
                    rg.addColorStop(0, UI.solid ? UI.accent : "#fff0a0");
                    rg.addColorStop(1, UI.solid ? uiShade(UI.accent, -0.3) : "#ff9a1c");
                    ctx.fillStyle = rg;
                    ctx.fill();
                    ctx.strokeStyle = "rgba(255,255,255," + (0.5 + 0.5 * pulse).toFixed(2) + ")";
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                bmp._baseTexture.update();
                if (RS.lvText) rsText(bmp, RS.lvText, rx, ry - 1, rw, 9, "center", "#5a2a00", "rgba(255,255,255,0.0)");
            }
            // きらめき(画像 > 星)
            const sparkSkin = rsSkin("resultSparkImage");
            for (const sp of this._sparks) {
                ctx.globalAlpha = rsClamp(sp.life / 20, 0, 1);
                if (sparkSkin) rsBlit(bmp, sparkSkin, sp.x - sp.r * 2, sp.y - sp.r * 2, sp.r * 4, sp.r * 4);
                else if (sparkSkin === undefined) rsStar(ctx, sp.x, sp.y, sp.r, "#fff3a0");
                ctx.globalAlpha = 1;
            }
            bmp._baseTexture.update();
        }
    }

    // ---- 下画面の「つぎへ」ボタン(通常/フォーカス/押下 それぞれ 画像 > 自動) ----
    class Sprite_RsNextButton extends Sprite {
        initialize(w, h, text) {
            super.initialize(new Bitmap(w, h));
            this._w = w;
            this._h = h;
            this._text = text;
            this._age = 0;
            this._show = 0;
            this._showTarget = false;
            this._focus = 0;
            this._press = 0;
            this._imgVer = -1;
            this._state = "";
            this._bmps = {};
            this.anchor.set(0.5);
        }

        // 状態ごとのビットマップを作る(画像があれば画像。文字は上に重ねる)
        build() {
            const make = skinKey => {
                const bmp = new Bitmap(this._w, this._h);
                const skin = rsSkin(skinKey);
                if (skin) {
                    rsBlit(bmp, skin, 0, 0, this._w, this._h);
                } else if (skin === undefined) {
                    // 自動: フォーカス/押下の画像が未指定なら、通常と同じ見た目(演出は拡大/発光で付ける)
                    const base = skinKey === "resultNextImage" ? undefined : rsSkin("resultNextImage");
                    if (base) rsBlit(bmp, base, 0, 0, this._w, this._h);
                    else if (base === undefined) this.drawGenerated(bmp);
                }
                if (this._text) rsText(bmp, this._text, 0, (this._h - 22) / 2 - 1, this._w - 18, 16, "center", "#ffffff", "rgba(120,50,0,0.95)");
                return bmp;
            };
            this._bmps = {
                normal: make("resultNextImage"),
                focus: prm.resultNextFocusImage ? make("resultNextFocusImage") : null,
                press: prm.resultNextPressImage ? make("resultNextPressImage") : null
            };
            this._state = "";
        }

        drawGenerated(bmp) {
            if (UI.solid) {
                // ソリッド: 橙の塗りつぶし + 面取り + 暗い矢印
                const ctx = bmp.context, w = this._w, h = this._h;
                uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, {
                    c: Math.round(h * 0.3), top: uiShade(UI.accent, 0.1), bottom: uiShade(UI.accent, -0.38),
                    border: "#ffe2bc", bw: 2, inner: false
                });
                ctx.beginPath();
                ctx.moveTo(w - 26, h / 2 - 6);
                ctx.lineTo(w - 26, h / 2 + 6);
                ctx.lineTo(w - 17, h / 2);
                ctx.closePath();
                ctx.fillStyle = "#1a0d02";
                ctx.fill();
                bmp._baseTexture.update();
                return;
            }
            const ctx = bmp.context, w = this._w, h = this._h;
            rsRoundRect(ctx, 0, 0, w, h, h / 2);
            ctx.fillStyle = "#0d1a36";
            ctx.fill();
            rsRoundRect(ctx, 2, 2, w - 4, h - 4, h / 2 - 2);
            ctx.fillStyle = "rgba(255,255,255,0.92)";
            ctx.fill();
            rsRoundRect(ctx, 3.5, 3.5, w - 7, h - 7, h / 2 - 3.5);
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, "#ffd45a");
            g.addColorStop(1, "#f0861c");
            ctx.fillStyle = g;
            ctx.fill();
            ctx.save();
            rsRoundRect(ctx, 3.5, 3.5, w - 7, h - 7, h / 2 - 3.5);
            ctx.clip();
            const gl = ctx.createLinearGradient(0, 0, 0, h * 0.55);
            gl.addColorStop(0, "rgba(255,255,255,0.55)");
            gl.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, w, h * 0.55);
            ctx.restore();
            ctx.beginPath();                                   // ▶
            ctx.moveTo(w - 26, h / 2 - 6);
            ctx.lineTo(w - 26, h / 2 + 6);
            ctx.lineTo(w - 17, h / 2);
            ctx.closePath();
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "rgba(90,40,0,0.9)";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();
            bmp._baseTexture.update();
        }

        hitTest(p) {
            return Math.abs(p.x - this.x) <= this._w / 2 && Math.abs(p.y - this.y) <= this._h / 2;
        }

        setShown(v) { this._showTarget = v; }

        update() {
            super.update();
            this._age++;
            if (this._imgVer !== rsImgVer) { this._imgVer = rsImgVer; this.build(); }
            this._show += Math.max(-0.1, Math.min(0.1, (this._showTarget ? 1 : 0) - this._show));
            const onBottom = TouchInput.screen() === "bottom";
            const over = this._showTarget && onBottom && this.hitTest(TouchInput.localPosition("bottom"));
            const pressed = over && TouchInput.isPressed();
            this._focus += Math.max(-0.2, Math.min(0.2, (over ? 1 : 0) - this._focus));
            this._press += Math.max(-0.3, Math.min(0.3, (pressed ? 1 : 0) - this._press));
            // 状態に合う画像へ切り替え
            const state = pressed && this._bmps.press ? "press" : over && this._bmps.focus ? "focus" : "normal";
            if (state !== this._state) {
                this._state = state;
                this.bitmap = this._bmps[state] || this._bmps.normal;
            }
            const pulse = this._showTarget ? 0.03 * Math.sin(this._age / 8) : 0;
            this.scale.set(this._show * (1 + pulse + 0.06 * this._focus - 0.08 * this._press));
            this.opacity = Math.round(255 * this._show);
            this.setBlendColor([255, 255, 255, Math.round(30 * this._focus)]);
        }
    }

    // ---- 下画面(獲得報酬) ----
    class Sprite_RsRewards extends Sprite {
        initialize(data, w, h) {
            super.initialize(new Bitmap(w, h));
            this._data = data;
            this._w = w;
            this._h = h;
            this._age = 0;
            this._skipped = false;
            this._countStart = 24;
            this._countFrames = RS.fill + 10;
            this._itemPage = 0;
            this._pageAge = 0;
            this._lastKey = "";
            this._iconSheet = ImageManager.loadSystem("IconSet");
            this._iconSheet.addLoadListener(() => { this._lastKey = ""; });
        }

        isDone() {
            return this._skipped || this._age >= this._countStart + this._countFrames;
        }

        skip() {
            this._skipped = true;
            this._lastKey = "";
        }

        progress() {
            if (this._skipped) return 1;
            return rsEase((this._age - this._countStart) / this._countFrames);
        }

        update() {
            super.update();
            this._age++;
            const items = this._data.items;
            const pages = Math.max(1, Math.ceil(items.length / 4));
            if (this.isDone() && pages > 1) {
                this._pageAge++;
                if (this._pageAge >= 150) {
                    this._pageAge = 0;
                    this._itemPage = (this._itemPage + 1) % pages;
                }
            }
            const p = this.progress();
            const key = [Math.round(p * 1000), this._itemPage, this._age < 40 ? this._age : 40, this.isDone() ? 1 : 0, rsImgVer].join("|");
            if (key !== this._lastKey) {
                this._lastKey = key;
                this.refresh(p);
            }
        }

        // パネル(画像 > 自動(ON時) > 描かない)
        panel(ctx, bmp, x, y, w, h, c1, c2, skinKey) {
            const skin = rsSkin(skinKey);
            if (skin) { rsBlit(bmp, skin, x, y, w, h); return; }
            if (skin === null || !RS.panelBg) return;
            if (UI.solid) {
                uiPanel(ctx, x + 0.5, y + 0.5, w - 1, h - 1, { c: 8, border: UI.accent, bw: 1.5 });
                return;
            }
            rsRoundRect(ctx, x, y, w, h, 9);
            ctx.fillStyle = "#0d1a36";
            ctx.fill();
            rsRoundRect(ctx, x + 1.5, y + 1.5, w - 3, h - 3, 8);
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.fill();
            rsRoundRect(ctx, x + 3, y + 3, w - 6, h - 6, 7);
            const g = ctx.createLinearGradient(0, y, 0, y + h);
            g.addColorStop(0, c1);
            g.addColorStop(1, c2);
            ctx.fillStyle = g;
            ctx.fill();
            ctx.save();
            rsRoundRect(ctx, x + 3, y + 3, w - 6, h - 6, 7);
            ctx.clip();
            const gl = ctx.createLinearGradient(0, y, 0, y + h * 0.5);
            gl.addColorStop(0, "rgba(255,255,255,0.25)");
            gl.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = gl;
            ctx.fillRect(x, y, w, h * 0.5);
            ctx.restore();
        }

        refresh(p) {
            const bmp = this.bitmap, ctx = bmp.context, W = this._w;
            bmp.clear();
            const slide = k => rsEase((this._age - k * 6) / 14);   // 上から順に滑り込む

            // 見出し「GET!」(画像 > 自動のリボン。文字は上に重ねる)
            let t = slide(0);
            if (t > 0.03) {
                ctx.save();
                ctx.globalAlpha = t;
                ctx.translate(-60 * (1 - t), 0);
                const hx = 0, hy = 10, hw = 190, hh = 28;
                const getSkin = rsSkin("resultGetImage");
                if (getSkin) {
                    rsBlit(bmp, getSkin, hx, hy, hw, hh);
                } else if (getSkin === undefined) {
                    ctx.beginPath();
                    ctx.moveTo(hx, hy);
                    ctx.lineTo(hx + hw, hy);
                    ctx.lineTo(hx + hw - 14, hy + hh / 2);
                    ctx.lineTo(hx + hw, hy + hh);
                    ctx.lineTo(hx, hy + hh);
                    ctx.closePath();
                    const rg = ctx.createLinearGradient(0, hy, 0, hy + hh);
                    rg.addColorStop(0, UI.solid ? "#232730" : "#3c7be0");
                    rg.addColorStop(1, UI.solid ? "#0a0b0e" : "#173a8c");
                    ctx.fillStyle = rg;
                    ctx.fill();
                    ctx.fillStyle = UI.solid ? UI.accent : "#ffe36a";
                    ctx.fillRect(hx, hy + hh - 3, hw - 6, 2);
                }
                bmp._baseTexture.update();
                if (RS.getLabel) rsGradText(bmp, RS.getLabel, getSkin ? hw / 2 : 70, hy + hh / 2, 22, UI.solid ? "#ffffff" : "#fff7c0", UI.solid ? "#f6a24a" : "#ffb52a", "rgba(40,20,0,0.95)", 4);
                ctx.restore();
            }

            // 経験値 / ゴールド
            const rows = [
                { y: 48, label: RS.expLabel, value: Math.round(this._data.exp * p), suffix: "", c1: "#3f7fe0", c2: "#1a3c8a", icon: "exp", panel: "resultExpPanelImage", iconSkin: "resultExpIconImage" },
                { y: 92, label: RS.goldLabel, value: Math.round(this._data.gold * p), suffix: " G", c1: "#e0a53a", c2: "#8a5a14", icon: "gold", panel: "resultGoldPanelImage", iconSkin: "resultGoldIconImage" }
            ];
            rows.forEach((row, i) => {
                const a = slide(i + 1);
                if (a <= 0.03) return;
                ctx.save();
                ctx.globalAlpha = a;
                ctx.translate(60 * (1 - a), 0);
                this.panel(ctx, bmp, 14, row.y, W - 28, 38, row.c1, row.c2, row.panel);
                // アイコン(画像 > 自動)
                const ix = 34, iy = row.y + 19;
                const iconSkin = rsSkin(row.iconSkin);
                if (iconSkin) {
                    rsBlit(bmp, iconSkin, ix - 12, iy - 12, 24, 24);
                } else if (iconSkin === undefined) {
                    if (row.icon === "exp") {
                        rsStar(ctx, ix, iy, 12, "#fff3a0");
                        rsStar(ctx, ix, iy, 6, "#ffffff");
                    } else {
                        ctx.beginPath();
                        ctx.arc(ix, iy, 11, 0, Math.PI * 2);
                        const cg = ctx.createRadialGradient(ix - 3, iy - 3, 1, ix, iy, 11);
                        cg.addColorStop(0, "#fff6b0");
                        cg.addColorStop(1, "#d8941a");
                        ctx.fillStyle = cg;
                        ctx.fill();
                        ctx.strokeStyle = "#7a4a08";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    }
                }
                bmp._baseTexture.update();
                if (row.label) rsText(bmp, row.label, 52, row.y + 9, 80, 15, "left", "#ffffff", "rgba(10,25,70,0.95)");
                rsText(bmp, row.value + row.suffix, 100, row.y + 5, W - 28 - 100, 24, "right", "#ffffff", "rgba(10,25,70,0.95)");
                ctx.restore();
            });

            // アイテム
            const a3 = slide(3);
            if (a3 > 0.03) {
                ctx.save();
                ctx.globalAlpha = a3;
                ctx.translate(60 * (1 - a3), 0);
                this.panel(ctx, bmp, 14, 136, W - 28, 62, "#3a9a6a", "#14583a", "resultItemPanelImage");
                bmp._baseTexture.update();
                if (RS.itemLabel) rsText(bmp, RS.itemLabel, 22, 138, 50, 10, "left", "#d8ffe8", "rgba(0,40,20,0.9)");
                const items = this._data.items;
                if (items.length === 0) {
                    if (RS.noItem) rsText(bmp, RS.noItem, 14, 160, W - 28, 14, "center", "#cfe9da", "rgba(0,40,20,0.9)");
                } else {
                    const pages = Math.ceil(items.length / 4);
                    const start = this._itemPage * 4;
                    for (let k = 0; k < 4 && start + k < items.length; k++) {
                        const it = items[start + k];
                        const col = k % 2, row = Math.floor(k / 2);
                        const cx = 22 + col * 140, cy = 150 + row * 22;
                        rsDrawIcon(bmp, it.item.iconIndex, cx, cy, 20);
                        rsText(bmp, it.item.name, cx + 23, cy - 1, 88, 11, "left", "#ffffff", "rgba(0,40,20,0.95)");
                        if (it.count > 1) rsText(bmp, "×" + it.count, cx + 100, cy - 1, 34, 11, "right", "#ffe9a0", "rgba(60,30,0,0.9)");
                    }
                    if (pages > 1) {
                        for (let k = 0; k < pages; k++) {
                            ctx.fillStyle = k === this._itemPage ? "#ffffff" : "rgba(255,255,255,0.35)";
                            ctx.beginPath();
                            ctx.arc(W - 30 - (pages - 1 - k) * 8, 143, 2.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
                ctx.restore();
            }
            bmp._baseTexture.update();
        }
    }

    // ---- リザルト全体 ----
    class Sprite_BattleResult extends Sprite {
        initialize(data, onClose) {
            super.initialize(new Bitmap(Graphics.physicalWidth, Graphics.physicalHeight));
            data = data || {};
            data.entries = Array.isArray(data.entries) ? data.entries : [];
            data.items = Array.isArray(data.items) ? data.items : [];   // 旧プラグインのデータには items が無い
            data.exp = Number(data.exp) || 0;
            data.gold = Number(data.gold) || 0;
            this.bitmap.fillAll(RS.dim);
            this._onClose = onClose;
            this._wait = 0;
            this._closing = false;
            this._skipped = false;
            this.opacity = 0;

            const top = Graphics.screenRect("top"), bot = Graphics.screenRect("bottom");
            // 上画面: 見出し + カード3x2
            this._top = new Sprite_RsScreen(top.width, top.height, RS.topBack, RS.topImage, RS_TOP_IMAGES);
            this._top.x = top.x;
            this._top.y = top.y;
            this.addChild(this._top);
            const banner = new Sprite_RsBanner(top.width, RS.titleText);
            this._top.content.addChild(banner);
            this._cards = [];
            const cols = 3, rows = 2, padX = 6, padY = 6, y0 = 44;
            const cw = Math.floor((top.width - padX * (cols + 1)) / cols);
            const ch = Math.floor((top.height - y0 - padY * rows) / rows);
            for (let i = 0; i < cols * rows; i++) {
                const card = new Sprite_RsCard(data.entries[i], i, cw, ch);
                card.x = padX + (i % cols) * (cw + padX) + cw / 2;
                card.y = y0 + Math.floor(i / cols) * (ch + padY) + ch / 2;
                this._top.content.addChild(card);
                this._cards.push(card);
            }
            // 下画面: 獲得報酬 + 「つぎへ」
            this._bottom = new Sprite_RsScreen(bot.width, bot.height, RS.botBack, RS.botImage, RS_BOTTOM_IMAGES);
            this._bottom.x = bot.x;
            this._bottom.y = bot.y;
            this.addChild(this._bottom);
            this._rewards = new Sprite_RsRewards(data, bot.width, bot.height);
            this._bottom.content.addChild(this._rewards);
            this._button = new Sprite_RsNextButton(150, 28, RS.hint);
            this._button.x = bot.width / 2;
            this._button.y = bot.height - 22;
            this._bottom.content.addChild(this._button);
        }

        isAllDone() {
            return this._cards.every(c => c.isDone()) && this._rewards.isDone();
        }

        update() {
            super.update();
            if (this._closing) {
                this.opacity -= 24;
                if (this.opacity <= 0) {
                    if (this.parent) this.parent.removeChild(this);
                    this._onClose();
                }
                return;
            }
            this.opacity = Math.min(255, this.opacity + 24);
            this._wait++;
            const done = this.isAllDone();
            this._button.setShown(done);
            if (this._wait < RS.minWait) return;
            const pressed = Input.isTriggered("ok") || Input.isTriggered("cancel") || TouchInput.isTriggered();
            if (!pressed) return;
            if (!done) {
                // 演出をスキップ(結果をすぐ表示)
                this._cards.forEach(c => c.skip());
                this._rewards.skip();
                SoundManager.playCursor();
            } else {
                SoundManager.playOk();
                this._closing = true;
            }
        }
    }

    //-------------------------------------------------------------------------
    // 戦闘中の上画面に重ねる画像(複数)
    //-------------------------------------------------------------------------
    const BATTLE_IMAGES = rsImageDefs("battleImages");

    // 画面座標(上画面の左上が原点)で配置するための層を作る
    Spriteset_Battle.prototype.makeDecorLayer = function(front) {
        const defs = BATTLE_IMAGES.filter(d => (d.layer === "front") === front);
        if (defs.length === 0) return null;
        const layer = new Sprite();
        layer.x = -this._battleField.x;
        layer.y = -this._battleField.y;
        for (const def of defs) layer.addChild(new Sprite_RsDecor(def, Graphics.width, Graphics.height));
        return layer;
    };

    // 奥の層: 戦闘背景(back1/back2)の直後・敵の前に入れる
    const _SpB_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        this._decorBack = this.makeDecorLayer(false);
        if (this._decorBack) this._battleField.addChild(this._decorBack);
        if (BattleManager._stageActive) {          // ステージ制: 開始の演出が終わるまで敵を出さない
            this._enemySprites = [];
            this._enemyHold = true;
            return;
        }
        _SpB_createEnemies.call(this);
    };

    // 手前の層: 敵・味方・立ち絵HUDを作り終えたあと、最前面に入れる(ダメージ表示はこの上に出る)
    const _SpB_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _SpB_createLowerLayer.call(this);
        this._decorFront = this.makeDecorLayer(true);
        if (this._decorFront) this._battleField.addChild(this._decorFront);
    };

    //-------------------------------------------------------------------------
    // 技名表示: 使った技の名前を、行動者の頭上にアイコンつきの帯で表示する
    //-------------------------------------------------------------------------
    const SB = {
        enabled: prm.skillBannerEnabled !== "false",
        showAttack: prm.skillBannerShowAttack === "true",
        showItems: prm.skillBannerShowItems === "true",
        h: Math.max(16, Number(prm.skillBannerHeight || 28)),
        minW: Math.max(40, Number(prm.skillBannerMinWidth || 120)),
        font: Math.max(8, Number(prm.skillBannerFontSize || 15)),
        cap: Math.max(0, Number(prm.skillBannerCap ?? 12)),
        frames: Math.max(20, Number(prm.skillBannerFrames || 60)),
        offY: Number(prm.skillBannerOffsetY || 0),
        c1: uiTheme(prm.skillBannerColor1, "#f4a638", "#ee8a24"),
        c2: uiTheme(prm.skillBannerColor2, "#c35a0c", "#a84a0a")
    };
    const SB_DEFS = {};
    parseJson(prm.skillBannerSkills, []).forEach(str => {
        const d = parseJson(str, null);
        if (d && d.skillId) SB_DEFS[Number(d.skillId)] = d;
    });

    // 画像の読み込み(ファイル名指定): Bitmap=表示可 / false=読み込み中 / null=指定なし・失敗
    const sbCache = {};
    const sbLoad = name => {
        if (!name) return null;
        if (!(name in sbCache)) {
            const b = ImageManager.loadSystem(name);
            b.addLoadListener(() => { rsImgVer++; });
            sbCache[name] = b;
        }
        const b = sbCache[name];
        if (b.isError()) return null;
        return b.isReady() && b.width > 0 ? b : false;
    };
    // 名前指定 > パラメータ指定 の順に解決(同じ戻り値)
    const sbResolve = (name, key) => {
        if (name) return sbLoad(name);
        if (key) {
            const r = rsSkin(key);
            return r === undefined ? null : (r === null ? false : r);
        }
        return null;
    };
    const sbMeasure = (text, size) => {
        const tmp = new Bitmap(1, 1);
        tmp.fontFace = uiFace();
        tmp.fontBold = true;
        tmp.fontSize = size;
        return Math.ceil(tmp.measureTextWidth(text));
    };

    class Sprite_SkillBanner extends Sprite {
        initialize(item, anchorFn, onEnd) {
            const def = SB_DEFS[item.id] || {};
            const meta = item.meta || {};
            const text = def.text || item.name;
            const size = SB.font;
            const h = SB.h;
            const iconBox = h - 6;
            const w = Math.max(SB.minW, 6 + iconBox + 8 + sbMeasure(text, size) + 16);
            super.initialize(new Bitmap(w, h));
            this._w = w;
            this._h = h;
            this._item = item;
            this._def = def;
            this._text = text;
            this._iconName = def.icon || meta["技名アイコン"] || meta.SkillBannerIcon || "";
            this._bgName = def.bgImage || meta["技名背景"] || meta.SkillBannerBg || "";
            this._c1 = def.color1 || SB.c1;
            this._c2 = def.color2 || SB.c2;
            this._anchorFn = anchorFn;
            this._onEnd = onEnd;
            this._age = 0;
            this._imgVer = -1;
            this.anchor.set(0.5);
            this.opacity = 0;
            const sheet = ImageManager.loadSystem("IconSet");
            if (!sheet._sbHooked) {
                sheet._sbHooked = true;
                sheet.addLoadListener(() => { rsImgVer++; });
            }
        }

        // 背景(画像 > 自動)。画像は左右の端を固定して中央だけ伸縮する
        drawBackground(bmp, ctx, w, h) {
            const skin = sbResolve(this._bgName, "skillBannerBgImage");
            if (skin) {
                const cap = Math.min(SB.cap, Math.floor(skin.width / 2));
                if (cap > 0 && skin.width > cap * 2) {
                    bmp.blt(skin, 0, 0, cap, skin.height, 0, 0, cap, h);
                    bmp.blt(skin, cap, 0, skin.width - cap * 2, skin.height, cap, 0, w - cap * 2, h);
                    bmp.blt(skin, skin.width - cap, 0, cap, skin.height, w - cap, 0, cap, h);
                } else {
                    rsBlit(bmp, skin, 0, 0, w, h);
                }
                return;
            }
            if (skin === false) return;                       // 読み込み中は何も描かない
            rsRoundRect(ctx, 0, 0, w, h, 6);
            ctx.fillStyle = "#1a0e04";
            ctx.fill();
            rsRoundRect(ctx, 1.5, 1.5, w - 3, h - 3, 5);
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, this._c1);
            g.addColorStop(1, this._c2);
            ctx.fillStyle = g;
            ctx.fill();
            ctx.save();
            rsRoundRect(ctx, 1.5, 1.5, w - 3, h - 3, 5);
            ctx.clip();
            const gl = ctx.createLinearGradient(0, 0, 0, h * 0.5);
            gl.addColorStop(0, UI.solid ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.45)");
            gl.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, w, h * 0.5);
            ctx.restore();
            rsRoundRect(ctx, 1.5, 1.5, w - 3, h - 3, 5);
            ctx.strokeStyle = UI.solid ? "rgba(255,226,188,0.9)" : "rgba(255,230,170,0.85)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // アイコンの台座 + アイコン(画像 > IconSet のアイコン番号)
        drawIcon(bmp, ctx, h) {
            const box = h - 6, x = 4, y = 3;
            const plate = rsSkin("skillBannerIconPlateImage");
            if (plate) rsBlit(bmp, plate, x, y, box, box);
            else if (plate === undefined) {
                rsRoundRect(ctx, x, y, box, box, 4);
                ctx.fillStyle = "rgba(20,10,0,0.78)";
                ctx.fill();
                rsRoundRect(ctx, x + 0.5, y + 0.5, box - 1, box - 1, 4);
                ctx.strokeStyle = "rgba(255,240,200,0.8)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            bmp._baseTexture.update();
            const pad = 2, isz = box - pad * 2;
            const img = sbResolve(this._iconName, null);
            if (img) {
                rsBlit(bmp, img, x + pad, y + pad, isz, isz);
            } else if (img === null) {
                const idx = this._def.iconIndex !== undefined && this._def.iconIndex !== "" && Number(this._def.iconIndex) >= 0
                    ? Number(this._def.iconIndex) : this._item.iconIndex;
                if (idx > 0) rsDrawIcon(bmp, idx, x + pad, y + pad, isz);
            }
        }

        redraw() {
            const bmp = this.bitmap, ctx = bmp.context, w = this._w, h = this._h;
            bmp.clear();
            this.drawBackground(bmp, ctx, w, h);
            bmp._baseTexture.update();
            this.drawIcon(bmp, ctx, h);
            const tx = 6 + (h - 6) + 8;
            bmp.fontFace = uiFace();
            bmp.fontBold = true;
            bmp.fontSize = SB.font;
            bmp.textColor = uiTextColor("#ffffff");
            bmp.outlineColor = "rgba(60,20,0,0.95)";
            bmp.outlineWidth = Math.max(3, Math.round(SB.font * 0.25));
            bmp.drawText(this._text, tx, (h - (SB.font + 6)) / 2, w - tx - 8, SB.font + 6, "left");
        }

        update() {
            super.update();
            this._age++;
            if (this._imgVer !== rsImgVer) {
                this._imgVer = rsImgVer;
                this.redraw();
            }
            const pos = this._anchorFn();
            // 出現(拡大しながら現れる) → 表示 → 上へ流れて消える
            let a = 1, sc = 1, dy = 0;
            const inF = 8, outF = 10;
            if (this._age < inF) {
                const t = rsEase(this._age / inF);
                a = t; sc = 1.4 - 0.4 * t; dy = -6 * (1 - t);
            } else if (this._age > SB.frames) {
                const u = (this._age - SB.frames) / outF;
                a = 1 - u; dy = -8 * u;
                if (u >= 1) {
                    if (this.parent) this.parent.removeChild(this);
                    this._onEnd();
                    return;
                }
            }
            // 画面の端ではみ出さないように寄せる
            const box = Graphics.uiBox("top");
            const x = rsClamp(pos.x, this._w / 2 + 2, box.width - this._w / 2 - 2);
            const y = Math.max(this._h / 2 + 2, pos.y - this._h / 2 + SB.offY);
            this.x = x;
            this.y = y + dy;
            this.scale.set(sc);
            this.opacity = Math.round(255 * a);
        }
    }

    // 行動者の頭上の位置(味方=立ち絵HUDのカードの上 / それ以外=スプライトの上)
    Spriteset_Battle.prototype.skillBannerAnchor = function(subject) {
        if (subject.isActor() && this._hud && this._hud.actorBannerPos) {
            const p = this._hud.actorBannerPos(subject);
            if (p) return p;
        }
        const spr = this.findTargetSprite(subject);
        if (spr) {
            let h = spr.height;
            if (!h && spr._mainSprite) h = spr._mainSprite.height * Math.abs(spr.scale.y);
            return { x: spr.x, y: spr.y - (h || 48) - 4 };
        }
        const box = Graphics.uiBox("top");
        return { x: box.width / 2, y: 36 };
    };

    Spriteset_Battle.prototype.showSkillBanner = function(subject, item) {
        if (!this._skillBannerLayer) return;
        const old = this._skillBanners.get(subject);
        if (old && old.parent) old.parent.removeChild(old);      // 同じ行動者の帯は、新しいものに置き換える
        const banner = new Sprite_SkillBanner(item, () => this.skillBannerAnchor(subject), () => {
            if (this._skillBanners.get(subject) === banner) this._skillBanners.delete(subject);
        });
        this._skillBannerLayer.addChild(banner);
        this._skillBanners.set(subject, banner);
    };

    // 帯の層(敵味方・立ち絵HUD・装飾画像のさらに前)
    const _SpB_createLowerLayer_sb = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _SpB_createLowerLayer_sb.call(this);
        this._skillBanners = new Map();
        this._skillBannerLayer = new Sprite();
        this._battleField.addChild(this._skillBannerLayer);
    };

    // 行動開始のときに表示する(ホイールのわざ・強制行動も同じ経路を通る)
    const _BM_startAction_sb = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BM_startAction_sb.call(this);
        if (!SB.enabled || !this._subject || !this._action) return;
        const action = this._action;
        const item = action.item();
        if (!item) return;
        if (action.isSkill()) {
            if (!SB.showAttack && (action.isAttack() || action.isGuard())) return;
        } else if (!SB.showItems) {
            return;
        }
        const scene = SceneManager._scene;
        const spriteset = scene && scene._spriteset;
        if (spriteset && spriteset.showSkillBanner) spriteset.showSkillBanner(this._subject, item);
    };

    //-------------------------------------------------------------------------
    // 敵を仲間にする: 戦闘後(リザルトのあと)に確率で起き上がり、仲間にするか選べる
    //   仲間にすると、テンプレートのアクターを複製した「新しいアクター」を生成する
    //-------------------------------------------------------------------------
    const RC = {
        enabled: prm.recruitEnabled !== "false",
        all: prm.recruitAllEnemies === "true",
        fallback: Number(prm.recruitFallbackActor || 1),
        defaultRate: Number(prm.recruitDefaultRate ?? 20),
        levelMode: prm.recruitLevelMode || "template",
        numbering: prm.recruitNumbering !== "false",
        enemyPortrait: prm.recruitUseEnemyPortrait !== "false",
        maxParty: Math.max(0, Number(prm.recruitMaxParty || 0)),
        speed: Math.max(1, Number(prm.recruitTextSpeed || 2)),
        msgApproach: prm.recruitMsgApproach ?? "倒した{name}が\nちかづいてきた!",
        msgJoin: prm.recruitMsgJoin ?? "{name}が\n仲間になった!",
        msgLeave: prm.recruitMsgLeave ?? "{name}は\n去っていった…",
        msgFull: prm.recruitMsgFull ?? "これ以上\n仲間にできない…",
        askLabel: prm.recruitAskLabel ?? "仲間にする?",
        yesLabel: prm.recruitYesLabel ?? "仲間にする",
        noLabel: prm.recruitNoLabel ?? "仲間にしない",
        seAppear: { name: String(prm.recruitSeAppear || ""), volume: Number(prm.recruitSeAppearVolume ?? 90), pitch: Number(prm.recruitSeAppearPitch ?? 100), pan: Number(prm.recruitSeAppearPan ?? 0) },
        seJoin: { name: String(prm.recruitSeJoin || ""), volume: Number(prm.recruitSeJoinVolume ?? 90), pitch: Number(prm.recruitSeJoinPitch ?? 100), pan: Number(prm.recruitSeJoinPan ?? 0) },
        meJoin: String(prm.recruitMeJoin || "")
    };
    const RC_ENTRIES = {};
    parseJson(prm.recruitEnemies, []).forEach(str => {
        const d = parseJson(str, null);
        if (d && d.enemyId) RC_ENTRIES[Number(d.enemyId)] = d;
    });
    const rcFormat = (text, name) => String(text).replace(/\\n/g, "\n").replace(/\{name\}/g, name);
    const rcPlaySe = (se, fallback) => {
        if (se.name) AudioManager.playSe({ name: se.name, volume: se.volume, pitch: se.pitch, pan: se.pan });
        else if (fallback) fallback();
    };

    // ---- 生成した仲間の保存 / 復元 ----
    Game_System.prototype.recruits = function() {
        if (!this._recruits) this._recruits = [];
        return this._recruits;
    };

    // テンプレートのアクターを複製して、新しいアクターのデータを作る
    const rcMakeData = rec => {
        const tpl = $dataActors[rec.templateId];
        if (!tpl) return null;
        const data = JSON.parse(JSON.stringify(tpl));
        data.id = rec.id;
        data.name = rec.name;
        data.note = (tpl.note || "") + (rec.extraNote || "");
        return data;
    };
    const rcRegister = rec => {
        const data = rcMakeData(rec);
        if (data) $dataActors[rec.id] = data;
    };
    // ロード時: セーブデータの仲間のアクター定義を、データベースへ復元する
    const _DM_extractSaveContents_rc = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DM_extractSaveContents_rc.call(this, contents);
        $gameSystem.recruits().forEach(rcRegister);
    };

    // 新しいアクターを生成してパーティに加える
    const rcCreate = (enemy, info) => {
        const recs = $gameSystem.recruits();
        const id = $dataActors.length;                         // 末尾に追加(既存のIDとは重ならない)
        const baseName = info.name || enemy.originalName();
        let name = baseName;
        if (RC.numbering) {
            const same = recs.filter(r => r.baseName === baseName).length;
            if (same > 0) name = baseName + (same + 1);
        }
        let extra = "\n<RecruitTemplate:" + info.templateId + ">\n<RecruitedFrom:" + enemy.enemyId() + ">";
        if (RC.enemyPortrait && enemy.battlerName()) extra += "\n<立ち絵敵:" + enemy.battlerName() + ">";
        const rec = { id, templateId: info.templateId, baseName, name, enemyId: enemy.enemyId(), extraNote: extra };
        recs.push(rec);
        rcRegister(rec);
        const actor = $gameActors.actor(id);
        const lvs = $gameParty.allMembers().map(a => a.level);
        if (RC.levelMode !== "template" && lvs.length > 0) {
            const lv = RC.levelMode === "max" ? Math.max(...lvs) : Math.round(lvs.reduce((a, b) => a + b, 0) / lvs.length);
            actor.changeLevel(Math.max(1, lv), false);
        }
        actor.recoverAll();
        $gameParty.addActor(id);
        return actor;
    };

    // ---- 倒した敵が仲間候補か / 確率 ----
    const rcResolve = enemy => {
        const data = $dataEnemies[enemy.enemyId()];
        const meta = (data && data.meta) || {};
        const entry = RC_ENTRIES[enemy.enemyId()];
        let templateId = entry ? Number(entry.templateActorId) || 0 : 0;
        if (!templateId) templateId = Number(meta["仲間"] || meta.Recruit || 0) || 0;
        if (!templateId && (entry || RC.all)) templateId = RC.fallback;
        if (!templateId || !$dataActors[templateId]) return null;
        let rate = entry && safeTrim(entry.rate) !== "" ? Number(entry.rate) : NaN;
        if (isNaN(rate)) rate = Number(meta["仲間確率"] ?? meta.RecruitRate ?? NaN);
        if (isNaN(rate)) rate = RC.defaultRate;
        return { templateId, rate, name: (entry && entry.name) || meta["仲間名"] || "" };
    };
    const rcRoll = () => {
        const list = [];
        for (const enemy of $gameTroop.deadMembers()) {
            const info = rcResolve(enemy);
            if (info && Math.random() * 100 < info.rate) list.push({ enemy, info });
        }
        return list;
    };

    // ---- 戦闘の流れ: 勝利時に抽選 → リザルトのあとで演出 ----
    const _BM_processVictory_rc = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        const cands = RC.enabled ? rcRoll().concat(this._stageRecruits || []) : [];
        _BM_processVictory_rc.call(this);
        if (cands.length > 0) {
            this._recruitQueue = cands;
            this._recruitActive = true;          // 演出が終わるまで、戦闘を終わらせない
        }
    };
    const _BM_isBusy_rc = BattleManager.isBusy;
    BattleManager.isBusy = function() {
        return !!this._recruitActive || _BM_isBusy_rc.call(this);
    };
    const _Scene_Battle_update_rc = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update_rc.apply(this, arguments);
        if (BattleManager._recruitActive && !this._recruitUi && !BattleManager._dsResultActive && !this._dsResultSprite &&
            !$gameMessage.isBusy() && !this._messageWindow.isOpening() && !this._messageWindow.isClosing()) {
            const queue = BattleManager._recruitQueue || [];
            const ui = new Sprite_RecruitUi(queue, () => {
                this._recruitUi = null;
                BattleManager._recruitQueue = null;
                BattleManager._recruitActive = false;
            });
            this.addChild(ui);
            this._recruitUi = ui;
        }
    };

    // ---- 文字を枠に収まるように折り返す ----
    const rcWrap = (bmp, text, maxW) => {
        const lines = [];
        for (const para of String(text).split("\n")) {
            let line = "";
            for (const ch of para) {
                if (line && bmp.measureTextWidth(line + ch) > maxW) { lines.push(line); line = ch; }
                else line += ch;
            }
            lines.push(line);
        }
        return lines;
    };

    // ---- ボタン(仲間にする / しない): 画像 > テーマの自動 ----
    class Sprite_RecruitButton extends Sprite {
        initialize(label, normalKey, focusKey) {
            super.initialize(new Bitmap(200, 38));
            this._label = label;
            this._normalKey = normalKey;
            this._focusKey = focusKey;
            this._w = 200;
            this._h = 38;
            this._focus = 0;
            this._focusTarget = false;
            this._press = 0;
            this._show = 0;
            this._age = 0;
            this._imgVer = -1;
            this._bmps = {};
            this.anchor.set(0.5);
        }

        build() {
            const make = (key, focus) => {
                const bmp = new Bitmap(this._w, this._h);
                const skin = rsSkin(key);
                const ctx = bmp.context, w = this._w, h = this._h;
                if (skin) rsBlit(bmp, skin, 0, 0, w, h);
                else if (skin === undefined) {
                    if (UI.solid) {
                        uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, {
                            c: 10, top: focus ? uiShade(UI.accent, 0.1) : UI.base2, bottom: focus ? uiShade(UI.accent, -0.38) : UI.base,
                            border: focus ? "#ffe2bc" : UI.line, bw: focus ? 2 : 1.5, inner: !focus
                        });
                        ctx.fillStyle = focus ? "#ffffff" : UI.accent;
                        ctx.fillRect(14, 10, 3, h - 20);
                    } else {
                        rsRoundRect(ctx, 0, 0, w, h, h / 2);
                        ctx.fillStyle = "#0d1a36";
                        ctx.fill();
                        rsRoundRect(ctx, 2, 2, w - 4, h - 4, h / 2 - 2);
                        ctx.fillStyle = "rgba(255,255,255,0.92)";
                        ctx.fill();
                        rsRoundRect(ctx, 3.5, 3.5, w - 7, h - 7, h / 2 - 3.5);
                        const g = ctx.createLinearGradient(0, 0, 0, h);
                        g.addColorStop(0, focus ? "#ffd45a" : "#5aa8f0");
                        g.addColorStop(1, focus ? "#f0861c" : "#2a62c4");
                        ctx.fillStyle = g;
                        ctx.fill();
                    }
                    bmp._baseTexture.update();
                }
                if (this._label) rsText(bmp, this._label, 0, (h - 22) / 2 - 1, w, 17, "center", "#ffffff", "rgba(10,25,70,0.95)");
                return bmp;
            };
            this._bmps = { normal: make(this._normalKey, false), focus: make(this._focusKey, true) };
            this._state = "";
        }

        setFocus(v) { this._focusTarget = v; }
        hitTest(p) { return Math.abs(p.x - this.x) <= this._w / 2 && Math.abs(p.y - this.y) <= this._h / 2; }

        update() {
            super.update();
            this._age++;
            if (this._imgVer !== rsImgVer) { this._imgVer = rsImgVer; this.build(); }
            this._focus += Math.max(-0.2, Math.min(0.2, (this._focusTarget ? 1 : 0) - this._focus));
            this._press += Math.max(-0.3, Math.min(0.3, 0 - this._press));
            const state = this._focusTarget ? "focus" : "normal";
            if (state !== this._state) { this._state = state; this.bitmap = this._bmps[state]; }
            this.scale.set(this._show * (1 + 0.05 * this._focus));
            this.opacity = Math.round(255 * this._show);
        }
    }

    // ---- 仲間にする演出全体 ----
    class Sprite_RecruitUi extends Sprite {
        initialize(queue, onClose) {
            super.initialize();
            this._queue = queue.slice();
            this._onClose = onClose;
            this._cur = null;
            this._phase = "none";
            this._age = 0;
            this._phaseAge = 0;
            this._closing = false;
            this._fade = 0;
            this._focus = 0;
            this._prevHit = -2;
            this._sparks = [];
            this._text = "";
            this._shown = 0;
            this._imgVer = -1;
            this._buttonsShow = 0;
            const top = Graphics.screenRect("top"), bot = Graphics.screenRect("bottom");

            // 上画面: 暗幕 + 敵 + 光 + メッセージ枠
            this._top = new Sprite();
            this._top.x = top.x;
            this._top.y = top.y;
            this.addChild(this._top);
            const dim = new Bitmap(top.width, top.height);
            dim.fillAll("rgba(0,0,0,0.5)");
            this._top.addChild(new Sprite(dim));
            this._enemy = new Sprite();
            this._enemy.anchor.set(0.5, 1);
            this._enemy.x = top.width / 2;
            this._enemy.y = 178;
            this._top.addChild(this._enemy);
            this._fx = new Sprite(new Bitmap(top.width, top.height));
            this._top.addChild(this._fx);
            this._box = new Sprite(new Bitmap(380, 48));
            this._box.x = 10;
            this._box.y = 188;
            this._top.addChild(this._box);
            this._textSprite = new Sprite(new Bitmap(360, 44));
            this._textSprite.x = 20;
            this._textSprite.y = 190;
            this._top.addChild(this._textSprite);
            this._cursor = new Sprite(new Bitmap(16, 10));
            this._cursor.x = 366;
            this._cursor.y = 220;
            this._top.addChild(this._cursor);

            // 下画面: 背景 + 見出し + 情報パネル + ボタン2つ
            this._bottom = new Sprite_RsScreen(bot.width, bot.height, RS.botBack, "", []);
            this._bottom.x = bot.x;
            this._bottom.y = bot.y;
            this.addChild(this._bottom);
            this._head = new Sprite(new Bitmap(bot.width, 28));
            this._head.y = 8;
            this._bottom.content.addChild(this._head);
            this._info = new Sprite(new Bitmap(292, 76));
            this._info.x = 14;
            this._info.y = 38;
            this._bottom.content.addChild(this._info);
            this._buttons = [
                new Sprite_RecruitButton(RC.yesLabel, "recruitYesImage", "recruitYesFocusImage"),
                new Sprite_RecruitButton(RC.noLabel, "recruitNoImage", "recruitNoFocusImage")
            ];
            this._buttons[0].x = this._buttons[1].x = bot.width / 2;
            this._buttons[0].y = 142;
            this._buttons[1].y = 188;
            this._buttons.forEach(b => this._bottom.content.addChild(b));
            rsText(this._head.bitmap, RC.askLabel, 0, 0, bot.width, 18, "center", "#ffffff");
            this.alpha = 0;
            this._bottom.alpha = 0;
            this.next();
        }

        // ---- 次の候補へ ----
        next() {
            const cand = this._queue.shift();
            if (!cand) { this._closing = true; return; }
            this._cur = cand;
            const enemy = cand.enemy;
            this._baseName = cand.info.name || enemy.originalName();
            const name = $gameSystem.isSideView() ? enemy.battlerName() : enemy.battlerName();
            this._enemyBmp = $gameSystem.isSideView() ? ImageManager.loadSvEnemy(name) : ImageManager.loadEnemy(name);
            this._enemy.bitmap = this._enemyBmp;
            this._enemy.setHue(enemy.battlerHue());
            this._enemy.opacity = 0;
            this._enemy.scale.set(0.4);
            this._enemyScale = 1;
            this._enemyBmp.addLoadListener(() => {
                const bw = this._enemyBmp.width, bh = this._enemyBmp.height;
                this._enemyScale = Math.min(1.3, 130 / Math.max(1, bh), 190 / Math.max(1, bw));
            });
            this._phase = "approach";
            this._phaseAge = 0;
            this._buttonsShow = 0;
            this._focus = 0;
            this._prevHit = -2;
            this._sparks = [];
            this.setText(rcFormat(RC.msgApproach, this._baseName));
            this.drawInfo();
            rcPlaySe(RC.seAppear, null);
        }

        setText(text) {
            this._text = text;
            this._shown = 0;
            this._wait = 0;
        }

        // ---- 描画: メッセージ枠 / 文字 / 情報パネル ----
        drawBox() {
            const bmp = this._box.bitmap, ctx = bmp.context, w = 380, h = 48;
            bmp.clear();
            const skin = rsSkin("recruitMessageImage");
            if (skin) rsBlit(bmp, skin, 0, 0, w, h);
            else if (skin === undefined) {
                if (UI.solid) {
                    uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, { c: 9, border: UI.accent, bw: 1.5 });
                } else {
                    rsRoundRect(ctx, 0, 0, w, h, 14);                        // やわらかい色の丸いメッセージ枠
                    const g = ctx.createLinearGradient(0, 0, 0, h);
                    g.addColorStop(0, "#f4f9ff");
                    g.addColorStop(1, "#bcd6f5");
                    ctx.fillStyle = g;
                    ctx.fill();
                    rsRoundRect(ctx, 1.5, 1.5, w - 3, h - 3, 13);
                    ctx.strokeStyle = "rgba(255,255,255,0.9)";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
            bmp._baseTexture.update();
            // ▽(文字が出きったら点滅)
            const cb = this._cursor.bitmap, cc = cb.context;
            cb.clear();
            const cur = rsSkin("recruitCursorImage");
            if (cur) rsBlit(cb, cur, 0, 0, 16, 10);
            else if (cur === undefined) {
                cc.beginPath();
                cc.moveTo(2, 2);
                cc.lineTo(14, 2);
                cc.lineTo(8, 9);
                cc.closePath();
                cc.fillStyle = UI.solid ? UI.accent : "#7aa6e0";
                cc.fill();
            }
            cb._baseTexture.update();
        }

        drawText() {
            const bmp = this._textSprite.bitmap;
            bmp.clear();
            bmp.fontFace = uiFace();
            bmp.fontSize = 16;
            const lines = rcWrap(bmp, this._text, 352);
            let left = this._shown;
            lines.forEach((line, i) => {
                if (left <= 0) return;
                const part = line.slice(0, left);
                left -= line.length;
                rsText(bmp, part, 2, i * 20, 356, 16, "left",
                    UI.solid ? "#ffffff" : "#2a3f66", UI.solid ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.0)");
            });
            this._total = lines.reduce((n, l) => n + l.length, 0);
        }

        // 下画面の情報パネル: 敵の画像 + テンプレートのアクターの能力
        drawInfo() {
            const bmp = this._info.bitmap, ctx = bmp.context, w = 292, h = 76;
            bmp.clear();
            const skin = rsSkin("recruitInfoPanelImage");
            if (skin) rsBlit(bmp, skin, 0, 0, w, h);
            else if (skin === undefined) {
                if (UI.solid) uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, { c: 8, border: UI.accent, bw: 1.5 });
                else {
                    rsRoundRect(ctx, 0, 0, w, h, 10);
                    ctx.fillStyle = "#0d1a36";
                    ctx.fill();
                    rsRoundRect(ctx, 2, 2, w - 4, h - 4, 9);
                    const g = ctx.createLinearGradient(0, 0, 0, h);
                    g.addColorStop(0, "#3a7be0");
                    g.addColorStop(1, "#173a8c");
                    ctx.fillStyle = g;
                    ctx.fill();
                }
            }
            bmp._baseTexture.update();
            const cand = this._cur;
            if (!cand) return;
            // 能力(テンプレートのアクターを仮に作って読み取る)
            let tmp = null;
            try { tmp = new Game_Actor(cand.info.templateId); } catch (e) { tmp = null; }
            if (tmp) {
                const lvs = $gameParty.allMembers().map(a => a.level);
                if (RC.levelMode !== "template" && lvs.length > 0) {
                    tmp.changeLevel(Math.max(1, RC.levelMode === "max" ? Math.max(...lvs) : Math.round(lvs.reduce((a, b) => a + b, 0) / lvs.length)), false);
                    tmp.recoverAll();
                }
            }
            rsText(bmp, this._baseName, 78, 6, 200, 17, "left");
            if (tmp) {
                rsText(bmp, "Lv " + tmp.level + "  " + (tmp.currentClass() ? tmp.currentClass().name : ""), 78, 26, 200, 11, "left", "#ffe9a0", "rgba(0,0,0,0.9)");
                rsText(bmp, "HP " + tmp.mhp + "   ATK " + tmp.atk + "   DEF " + tmp.def, 78, 42, 210, 11, "left");
                rsText(bmp, "MAT " + tmp.mat + "   MDF " + tmp.mdf + "   AGI " + tmp.agi, 78, 56, 210, 11, "left");
            }
            // 敵の画像(小さく)
            const small = new Bitmap(64, 64);
            const src = this._enemyBmp;
            src.addLoadListener(() => {
                const k = Math.min(60 / Math.max(1, src.width), 60 / Math.max(1, src.height), 1);
                const dw = src.width * k, dh = src.height * k;
                small.blt(src, 0, 0, src.width, src.height, (64 - dw) / 2, (64 - dh) / 2, dw, dh);
                this._info.bitmap.blt(small, 0, 0, 64, 64, 8, 6, 64, 64);
            });
        }

        // ---- 入力 ----
        update() {
            super.update();
            this._age++;
            if (this._imgVer !== rsImgVer) {
                this._imgVer = rsImgVer;
                this.drawBox();
                this.drawInfo();
            }
            if (this._closing) {
                this._fade = Math.max(0, this._fade - 0.1);
                this.alpha = this._fade;
                if (this._fade <= 0) {
                    if (this.parent) this.parent.removeChild(this);
                    this._onClose();
                }
                return;
            }
            this._fade = Math.min(1, this._fade + 0.1);
            this.alpha = this._fade;
            this._bottom.alpha = Math.min(1, this._bottom.alpha + 0.1);
            this._phaseAge++;
            this.updateEnemy();
            this.updateSparks();
            this.updateButtons();
            if (this._phase === "approach") this.updateApproach();
            else if (this._phase === "choice") this.updateChoice();
            else if (this._phase === "result") this.updateResult();
        }

        // 文字送り: 決定/クリックで全文表示
        advanceText() {
            const speed = RC.speed;
            this._wait++;
            if (this._shown < (this._total ?? 9999)) {
                if (this._wait % speed === 0) this._shown++;
                this.drawText();
            }
            const done = this._total !== undefined && this._shown >= this._total;
            const press = this._phaseAge > 8 && (Input.isTriggered("ok") || TouchInput.isTriggered());
            if (!done && press) { this._shown = this._total ?? this._shown; this.drawText(); }
            // ▽の点滅
            this._cursor.opacity = done ? Math.round(255 * (0.4 + 0.6 * Math.abs(Math.sin(this._age / 8)))) : 0;
            return { done, press: done && press };
        }

        updateApproach() {
            const r = this.advanceText();
            if (r.done && this._phaseAge > 20 + this._text.length * RC.speed) this.setPhase("choice");
            else if (r.press) this.setPhase("choice");
        }

        setPhase(phase) {
            this._phase = phase;
            this._phaseAge = 0;
            this._prevHit = -2;
        }

        updateChoice() {
            this._buttonsShow = Math.min(1, this._buttonsShow + 0.12);
            const p = TouchInput.localPosition("bottom");
            const onBottom = TouchInput.screen() === "bottom";
            let hit = -1;
            if (onBottom) this._buttons.forEach((b, i) => { if (b._show > 0.5 && b.hitTest(p)) hit = i; });
            if (this._prevHit === -2) this._prevHit = hit;
            const entered = hit >= 0 && hit !== this._prevHit;
            this._prevHit = hit;
            if (entered && hit !== this._focus) { this._focus = hit; SoundManager.playCursor(); }
            if (Input.isTriggered("up") || Input.isTriggered("down")) {
                this._focus = 1 - this._focus;
                SoundManager.playCursor();
            }
            this._buttons.forEach((b, i) => b.setFocus(i === this._focus));
            if (this._phaseAge < 14) return;
            if (TouchInput.isTriggered() && hit >= 0) this.decide(hit === 0);
            else if (Input.isTriggered("ok")) this.decide(this._focus === 0);
            else if (Input.isTriggered("cancel") || TouchInput.isCancelled()) this.decide(false);
        }

        updateButtons() {
            const target = this._phase === "choice" ? 1 : 0;
            this._buttons.forEach((b, i) => {
                b._show += Math.max(-0.12, Math.min(0.12, target - b._show));
                b.y = (i === 0 ? 142 : 188) + 14 * (1 - b._show);
            });
        }

        // ---- 決定 ----
        decide(yes) {
            const cand = this._cur;
            if (yes && RC.maxParty > 0 && $gameParty.allMembers().length >= RC.maxParty) {
                SoundManager.playBuzzer();
                this._joined = false;
                this.setText(rcFormat(RC.msgFull, this._baseName));
                this._resultKind = "full";
            } else if (yes) {
                const actor = rcCreate(cand.enemy, cand.info);
                this._joined = true;
                this._resultKind = "join";
                rcPlaySe(RC.seJoin, () => SoundManager.playRecovery());
                if (RC.meJoin) AudioManager.playMe({ name: RC.meJoin, volume: 90, pitch: 100, pan: 0 });
                this.setText(rcFormat(RC.msgJoin, actor.name()));
                this.burst();
            } else {
                SoundManager.playCancel();
                this._joined = false;
                this._resultKind = "leave";
                this.setText(rcFormat(RC.msgLeave, this._baseName));
            }
            this.setPhase("result");
        }

        updateResult() {
            const r = this.advanceText();
            if (r.press || (r.done && this._phaseAge > 70 + this._text.length * RC.speed)) this.next();
        }

        // ---- 敵の登場・退場 ----
        updateEnemy() {
            const e = this._enemy;
            if (this._phase === "approach") {
                const t = rsEase(this._phaseAge / 24);
                e.opacity = Math.round(255 * t);
                const s = this._enemyScale * (0.4 + 0.6 * t + Math.sin(t * Math.PI) * 0.12);
                e.scale.set(s);
                e.y = 178;
            } else if (this._phase === "choice") {
                e.opacity = 255;
                e.scale.set(this._enemyScale);
                e.y = 178 + Math.sin(this._age / 14) * 2;
            } else if (this._phase === "result") {
                const t = rsEase(this._phaseAge / 24);
                if (this._resultKind === "join") {
                    e.scale.set(this._enemyScale * (1 - 0.5 * t));          // 光になって吸い込まれる
                    e.opacity = Math.round(255 * (1 - t));
                    e.y = 178 - 20 * t;
                } else {
                    e.opacity = Math.round(255 * (1 - t));                  // 去っていく
                    e.x = 200 + 40 * t;
                }
            }
            if (this._phase !== "result") e.x = 200;
        }

        burst() {
            for (let i = 0; i < 28; i++) {
                const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 3;
                this._sparks.push({ x: 200, y: 140, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 30 + Math.floor(Math.random() * 20), r: 2 + Math.random() * 3 });
            }
        }

        updateSparks() {
            const bmp = this._fx.bitmap, ctx = bmp.context;
            bmp.clear();
            // 起き上がるときの輪
            if (this._phase === "approach") {
                const t = Math.min(1, this._phaseAge / 30);
                ctx.beginPath();
                ctx.arc(200, 150, 20 + t * 90, 0, Math.PI * 2);
                ctx.lineWidth = 4 * (1 - t) + 1;
                ctx.strokeStyle = UI.solid ? "rgba(240,138,36," + (0.8 * (1 - t)).toFixed(2) + ")" : "rgba(255,255,255," + (0.8 * (1 - t)).toFixed(2) + ")";
                ctx.stroke();
            }
            for (const sp of this._sparks) { sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.06; sp.life--; }
            this._sparks = this._sparks.filter(sp => sp.life > 0);
            for (const sp of this._sparks) {
                ctx.globalAlpha = rsClamp(sp.life / 20, 0, 1);
                rsStar(ctx, sp.x, sp.y, sp.r, UI.solid ? "#ffc27a" : "#fff3a0");
                ctx.globalAlpha = 1;
            }
            bmp._baseTexture.update();
        }
    }

    //-------------------------------------------------------------------------
    // ステージ制の戦闘: 1回の戦闘で複数の敵グループと順に戦う(背景は同一・シームレス)
    //-------------------------------------------------------------------------
    const ST = {
        enabled: prm.stageEnabled !== "false",
        format: prm.stageFormat ?? "STAGE {n}/{total}",
        introFrames: Math.max(30, Number(prm.stageIntroFrames || 90)),
        clearBanner: prm.stageClearBanner !== "false",
        clearText: prm.stageClearText ?? "STAGE CLEAR!",
        indicator: prm.stageShowIndicator !== "false",
        indicatorX: Number(prm.stageIndicatorX ?? 2),
        indicatorY: Number(prm.stageIndicatorY ?? 2),
        hideEmerge: prm.stageHideEmerge !== "false",
        stepCount: Math.max(1, Number(prm.stageStepCount || 4)),
        stepInterval: Math.max(4, Number(prm.stageStepInterval || 16)),
        scroll: Number(prm.stageScrollSpeed ?? 3),
        synth: prm.stageSynth !== "false",
        jingleMe: String(prm.stageJingleMe || ""),
        jingleSe: { name: String(prm.stageJingleSe || ""), volume: Number(prm.stageJingleSeVolume ?? 90), pitch: Number(prm.stageJingleSePitch ?? 100), pan: Number(prm.stageJingleSePan ?? 0) },
        stepSe: { name: String(prm.stageStepSe || ""), volume: Number(prm.stageStepSeVolume ?? 90), pitch: Number(prm.stageStepSePitch ?? 100), pan: Number(prm.stageStepSePan ?? 0) },
        stepFade: Math.max(0, Number(prm.stageStepFadeFrames ?? 8)),
        revealGap: Math.max(0, Number(prm.stageRevealGap ?? 10)),
        cutinImages: rsImageDefs("stageCutinImages"),
        clearImages: rsImageDefs("stageClearImages")
    };

    // ---- 音: ファイル指定があればそれ、なければ簡易的に自動生成(WebAudio) ----
    let stageCtx = null;
    const stageAudio = () => {
        try {
            if (window.WebAudio && WebAudio._context) return WebAudio._context;
            if (!stageCtx) stageCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (stageCtx.state === "suspended") stageCtx.resume();
            return stageCtx;
        } catch (e) {
            return null;
        }
    };
    const stageVol = v => v * (window.ConfigManager && ConfigManager.seVolume !== undefined ? ConfigManager.seVolume : 100) / 100;
    const stageSynthStep = variant => {          // 低めの、やわらかい足音
        const ctx = stageAudio();
        if (!ctx) return;
        const n = Math.floor(ctx.sampleRate * 0.11);
        const buf = ctx.createBuffer(1, n, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 300 + variant * 90;
        const gain = ctx.createGain();
        gain.gain.value = stageVol(0.9);
        src.connect(f);
        f.connect(gain);
        gain.connect(ctx.destination);
        src.start();
    };
    const stageSynthJingle = () => {              // 4音のアルペジオ
        const ctx = stageAudio();
        if (!ctx) return;
        const t0 = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = "triangle";
            osc.frequency.value = freq;
            const gain = ctx.createGain();
            const t = t0 + i * 0.09;
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(stageVol(0.28), t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.6);
        });
    };
    const stagePlaySe = (se, fallback) => {
        if (se.name) AudioManager.playSe({ name: se.name, volume: se.volume, pitch: se.pitch, pan: se.pan });
        else if (ST.synth && fallback) fallback();
    };
    // 足音の効果音を、歩き終わりで切る(長い音源が戦闘中まで残らないように)
    const stageStopSteps = () => {
        try {
            const name = ST.stepSe.name;
            if (!name) return;
            const sec = ST.stepFade / 60;
            for (const b of (AudioManager._seBuffers || [])) {
                if (b && b.name === name && b.isPlaying && b.isPlaying()) {
                    if (sec > 0 && b.fadeOut) b.fadeOut(sec); else b.stop();
                }
            }
        } catch (e) { /* 音の停止に失敗しても進行は止めない */ }
    };
    const stagePlayJingle = () => {
        if (ST.jingleMe) AudioManager.playMe({ name: ST.jingleMe, volume: 90, pitch: 100, pan: 0 });
        else stagePlaySe(ST.jingleSe, stageSynthJingle);
    };

    // ---- 戦闘の流れ ----
    PluginManager.registerCommand(PN, "setStages", args => {
        const ids = String(args.troops || "").split(/[,、\s]+/).map(Number).filter(n => n > 0 && $dataTroops[n]);
        $gameTemp._stagePending = ids.length > 0 ? ids : null;
    });

    const _BM_setup_st = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BM_setup_st.call(this, troopId, canEscape, canLose);
        this._stageList = null;
        this._stageIndex = 0;
        this._stageAccum = null;
        this._stageRecruits = null;
        this._stageBusy = false;
        this._stageWalking = false;
        this._stageActive = false;
        let rest = $gameTemp._stagePending;
        $gameTemp._stagePending = null;
        if (!rest) {
            const troop = $dataTroops[troopId] || {};
            const v = troop.meta && (troop.meta["ステージ"] ?? troop.meta.Stages);
            if (v) rest = String(v).split(/[,、\s]+/).map(Number).filter(n => n > 0 && $dataTroops[n]);
        }
        if (ST.enabled && rest && rest.length > 0) {
            this._stageList = [troopId].concat(rest);
            this._stageActive = true;
            this._stageBusy = true;          // 開始の演出が終わるまで、戦闘を始めない
        }
    };
    BattleManager.stageTotal = function() { return this._stageList ? this._stageList.length : 1; };
    BattleManager.isLastStage = function() { return !this._stageActive || this._stageIndex >= this._stageList.length - 1; };

    const _BM_isBusy_st = BattleManager.isBusy;
    BattleManager.isBusy = function() {
        return !!this._stageBusy || _BM_isBusy_st.call(this);
    };
    const _BM_displayStartMessages_st = BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        if (this._stageActive && ST.hideEmerge) return;
        _BM_displayStartMessages_st.call(this);
    };

    // 報酬: 途中のステージぶんを、最後のステージの報酬に合算する
    const _BM_makeRewards_st = BattleManager.makeRewards;
    BattleManager.makeRewards = function() {
        _BM_makeRewards_st.call(this);
        const acc = this._stageAccum;
        if (acc) {
            this._rewards.exp += acc.exp;
            this._rewards.gold += acc.gold;
            this._rewards.items = this._rewards.items.concat(acc.items);
        }
    };

    // 勝利: 途中のステージなら、戦闘を終わらせずに次のステージへ
    const _BM_processVictory_st = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        if (this._stageActive && !this.isLastStage()) {
            this.processStageClear();
            return;
        }
        _BM_processVictory_st.call(this);
    };
    BattleManager.processStageClear = function() {
        _BM_makeRewards_st.call(this);                           // このステージ単体の報酬(合算なし)
        const r = this._rewards;
        const acc = this._stageAccum || (this._stageAccum = { exp: 0, gold: 0, items: [] });
        acc.exp += r.exp;
        acc.gold += r.gold;
        acc.items = acc.items.concat(r.items);
        if (RC.enabled) this._stageRecruits = (this._stageRecruits || []).concat(rcRoll());
        this._stageBusy = true;
        const scene = SceneManager._scene;
        if (scene && scene.startStageDirector) scene.startStageDirector("clear");
        else this._stageBusy = false;
    };
    // 次の敵グループへ切り替える(戦闘背景・味方はそのまま)
    BattleManager.nextStage = function() {
        this._stageIndex++;
        $gameTroop.setup(this._stageList[this._stageIndex]);
        $gameTroop.onBattleStart(false);
        for (const m of $gameParty.members()) m.clearActions();
        this._subject = null;
        this._action = null;
        this._targets = [];
        this._actionBattlers = [];
        this._tpbNeedsPartyCommand = false;
        this._phase = "start";
        const scene = SceneManager._scene;
        if (scene && scene._spriteset && scene._spriteset.resetEnemies) scene._spriteset.resetEnemies();
    };
    const _BM_endBattle_st = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        this._stageBusy = false;
        this._stageWalking = false;
        _BM_endBattle_st.call(this, result);
    };

    // 敵のスプライトを作り直す(戦闘背景・味方は触らない)
    // 敵のスプライトを外して、演出が終わるまで保持する(敵そのものは Game_Troop に作られている)
    Spriteset_Battle.prototype.resetEnemies = function() {
        for (const sprite of this._enemySprites) if (sprite.parent) sprite.parent.removeChild(sprite);
        this._enemySprites = [];
        this._enemyHold = true;
        this._revealQueue = [];
    };
    // 敵を、左から順に(間隔をあけて)出す。各敵は「現れる」エフェクトでフェードインする
    Spriteset_Battle.prototype.revealEnemies = function(gap) {
        this._enemyHold = false;
        const list = $gameTroop.members().slice().sort((a, b) => a.screenX() - b.screenX());
        this._revealQueue = list.map((enemy, i) => ({ enemy, t: i * gap }));
    };
    Spriteset_Battle.prototype.isRevealing = function() {
        return !!this._revealQueue && this._revealQueue.length > 0;
    };
    Spriteset_Battle.prototype.addEnemySprite = function(enemy) {
        const sprite = new Sprite_Enemy(enemy);
        const first = this._actorSprites && this._actorSprites[0];
        const base = first ? this._battleField.children.indexOf(first) - this._enemySprites.length : this._battleField.children.length;
        this._enemySprites.push(sprite);
        this._battleField.addChildAt(sprite, base + this._enemySprites.length - 1);
        // 奥行き(下にいる敵ほど手前)に並べ直す
        const sorted = this._enemySprites.slice().sort(this.compareEnemySprite.bind(this));
        sorted.forEach((spr, i) => this._battleField.setChildIndex(spr, base + i));
    };
    const _SpB_update_st = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _SpB_update_st.call(this);
        if (!this._revealQueue || this._revealQueue.length === 0) return;
        for (const item of this._revealQueue) item.t--;
        const ready = this._revealQueue.filter(item => item.t <= 0);
        if (ready.length === 0) return;
        this._revealQueue = this._revealQueue.filter(item => item.t > 0);
        for (const item of ready) this.addEnemySprite(item.enemy);
    };

    // ---- 表示: ステージの帯 ----
    class Sprite_StageBanner extends Sprite {
        initialize(text, frames, skinKey) {
            super.initialize(new Bitmap(400, 76));
            this._text = text;
            this._skinKey = skinKey || "stageBannerImage";
            this._frames = frames;
            this._age = 0;
            this._imgVer = -1;
            this.y = 58;
            this.opacity = 0;
            this.draw();
        }

        draw() {
            const bmp = this.bitmap, ctx = bmp.context, w = 400, h = 76;
            bmp.clear();
            const skin = rsSkin(this._skinKey);
            if (skin) rsBlit(bmp, skin, 0, 0, w, h);
            else if (skin === undefined) {
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, UI.solid ? "rgba(26,29,36,0.95)" : "rgba(40,90,200,0.93)");
                g.addColorStop(1, UI.solid ? "rgba(6,7,9,0.95)" : "rgba(14,34,96,0.93)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 8, w, h - 16);
                ctx.fillStyle = UI.solid ? UI.accent : "#ffe36a";
                ctx.fillRect(0, 8, w, 3);
                ctx.fillRect(0, h - 11, w, 3);
                if (UI.solid) {                                     // 左右の斜めのアクセント
                    ctx.beginPath();
                    ctx.moveTo(0, 8); ctx.lineTo(70, 8); ctx.lineTo(48, h - 8); ctx.lineTo(0, h - 8);
                    ctx.closePath();
                    ctx.fillStyle = "rgba(240,138,36,0.16)";
                    ctx.fill();
                }
            }
            bmp._baseTexture.update();
            if (this._text) rsGradText(bmp, this._text, w / 2, h / 2, 34,
                UI.solid ? "#ffffff" : "#fff7c0", UI.solid ? "#f6a24a" : "#ffb52a", "rgba(0,0,0,0.9)", 6);
        }

        update() {
            super.update();
            this._age++;
            if (this._imgVer !== rsImgVer) { this._imgVer = rsImgVer; this.draw(); }
            const inF = 14, outF = 14;
            const out = this._frames - outF;
            if (this._age < inF) {                       // 左から滑り込む
                const t = rsEase(this._age / inF);
                this.x = -160 * (1 - t);
                this.opacity = Math.round(255 * t);
            } else if (this._age > out) {                // 右へ抜ける
                const u = rsClamp((this._age - out) / outF, 0, 1);
                this.x = 160 * u;
                this.opacity = Math.round(255 * (1 - u));
            } else {
                this.x = 0;
                this.opacity = 255;
            }
        }
    }

    // ---- 表示: 左上の現在のステージ ----
    class Sprite_StageIndicator extends Sprite {
        initialize() {
            super.initialize(new Bitmap(112, 22));
            this._last = "";
            this._imgVer = -1;
            this.x = ST.indicatorX;
            this.y = ST.indicatorY;
        }

        update() {
            super.update();
            const key = BattleManager._stageIndex + "/" + BattleManager.stageTotal() + "/" + rsImgVer;
            if (key === this._last) return;
            this._last = key;
            const bmp = this.bitmap, ctx = bmp.context, w = 112, h = 22;
            bmp.clear();
            const skin = rsSkin("stageIndicatorImage");
            if (skin) rsBlit(bmp, skin, 0, 0, w, h);
            else if (skin === undefined) {
                if (UI.solid) uiPanel(ctx, 0.5, 0.5, w - 1, h - 1, { c: 5, border: UI.accent, bw: 1.5, inner: false });
                else {
                    rsRoundRect(ctx, 0, 0, w, h, 6);
                    ctx.fillStyle = "rgba(20,40,100,0.85)";
                    ctx.fill();
                }
            }
            bmp._baseTexture.update();
            rsText(bmp, ST.format.replace("{n}", BattleManager._stageIndex + 1).replace("{total}", BattleManager.stageTotal()), 0, 1, w, 13, "center", "#ffffff");
        }
    }
    uiCategorize(Sprite_StageIndicator, "stage", ["update"]);
    const _SpB_createLowerLayer_st = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _SpB_createLowerLayer_st.call(this);
        if (BattleManager._stageActive && ST.indicator) {
            this._stageIndicator = new Sprite_StageIndicator();
            this._battleField.addChild(this._stageIndicator);
        }
    };

    // ---- 進行役: 開始の演出 / ステージクリア → 歩く → 次のステージの演出 ----
    //-------------------------------------------------------------------------
    // ステージの疑似3D前進演出: 床と左右の壁を、奥行きに合わせて縮めながら並べ、手前へ流して「奥へ進む」ように見せる
    //   床・天井: 1行(奥行き)ごとに、模様の1行を、その距離の大きさに引き伸ばして並べる
    //   壁: 1列ごとに、模様の1列を、その距離の高さに引き伸ばす
    //-------------------------------------------------------------------------
    const ST3 = {
        enabled: prm.stage3dEnabled !== "false",
        speed: Math.max(0.05, Number(prm.stage3dSpeed ?? 1)),
        horizon: Number(prm.stage3dHorizon ?? 100),
        bob: Math.max(0, Number(prm.stage3dBob ?? 2)),
        floorRepeat: Math.max(0.1, Number(prm.stage3dFloorRepeat || 1)),
        wallRepeat: Math.max(0.1, Number(prm.stage3dWallRepeat || 1.5)),
        fog: prm.stage3dFogColor || "#0b0d11",
        fogStrength: Math.max(0, Math.min(1, Number(prm.stage3dFogStrength ?? 0.9))),
        fade: Math.max(1, Number(prm.stage3dFadeFrames ?? 12)),
        div: Math.max(1, Math.min(4, Math.round(Number(prm.stage3dResolution || 2))))
    };

    // 画像がないときの、自動で描く模様
    const st3Default = kind => {
        const bmp = new Bitmap(128, 128), ctx = bmp.context;
        if (kind === "floor") {
            const a = UI.solid ? "#222730" : "#c9d6ec", b = UI.solid ? "#171a21" : "#a9bbdc";
            ctx.fillStyle = a; ctx.fillRect(0, 0, 128, 128);
            ctx.fillStyle = b; ctx.fillRect(0, 0, 64, 64); ctx.fillRect(64, 64, 64, 64);
            ctx.fillStyle = UI.solid ? "#07080a" : "rgba(255,255,255,0.9)";       // 目地
            ctx.fillRect(0, 0, 128, 3); ctx.fillRect(0, 64, 128, 3); ctx.fillRect(0, 0, 3, 128); ctx.fillRect(64, 0, 3, 128);
            ctx.fillStyle = UI.solid ? "rgba(240,138,36,0.55)" : "rgba(60,90,160,0.5)";   // 目地の交点の鋲
            for (const [x, y] of [[1, 1], [65, 1], [1, 65], [65, 65]]) ctx.fillRect(x - 3, y - 3, 8, 8);
        } else if (kind === "wall") {
            const g = ctx.createLinearGradient(0, 0, 0, 128);
            g.addColorStop(0, UI.solid ? "#232831" : "#7e92b8");
            g.addColorStop(1, UI.solid ? "#0e1015" : "#566a94");
            ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
            ctx.fillStyle = UI.solid ? UI.accent : "#ffe9a0"; ctx.fillRect(0, 0, 128, 8);             // 上の飾り線
            ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(0, 108, 128, 20);                       // 巾木
            ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 8, 14, 100); ctx.fillRect(114, 8, 14, 100);   // 柱
            ctx.strokeStyle = UI.solid ? "rgba(240,138,36,0.5)" : "rgba(255,255,255,0.6)";
            ctx.lineWidth = 2; ctx.strokeRect(26, 26, 76, 66);                                       // 壁のパネル
            ctx.fillStyle = UI.solid ? UI.accent : "#fff3b0";
            ctx.beginPath(); ctx.arc(64, 59, 5, 0, Math.PI * 2); ctx.fill();                          // 明かり
        } else if (kind === "ceiling") {
            ctx.fillStyle = UI.solid ? "#0d0f13" : "#6b7fa6"; ctx.fillRect(0, 0, 128, 128);
            ctx.fillStyle = UI.solid ? "#1a1d24" : "#8da0c6";
            ctx.fillRect(0, 0, 128, 10); ctx.fillRect(0, 64, 128, 6);
        } else {                                                                                      // 遠景: 霧の色→明るい光
            const [r, g, b] = uiRgb(ST3.fog);
            const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 90);
            grad.addColorStop(0, UI.solid ? "rgb(" + Math.min(255, r + 70) + "," + Math.min(255, g + 62) + "," + Math.min(255, b + 52) + ")" : "#e8f2ff");
            grad.addColorStop(1, "rgb(" + r + "," + g + "," + b + ")");
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 128, 128);
        }
        bmp._baseTexture.update();
        return bmp;
    };
    const st3AvgCache = new WeakMap();
    const st3Avg = (bmp, el) => {                                 // 遠い行(細かすぎて並べられない)の代わりに塗る平均色
        if (st3AvgCache.has(bmp)) return st3AvgCache.get(bmp);
        let color = "rgb(40,40,48)";
        try {
            const c = document.createElement("canvas");
            c.width = c.height = 1;
            const x = c.getContext("2d");
            x.drawImage(el, 0, 0, bmp.width, bmp.height, 0, 0, 1, 1);
            const d = x.getImageData(0, 0, 1, 1).data;
            color = "rgb(" + d[0] + "," + d[1] + "," + d[2] + ")";
        } catch (e) { /* 取得できなければ既定色 */ }
        st3AvgCache.set(bmp, color);
        return color;
    };

    class Sprite_Corridor3D extends Sprite {
        initialize() {
            const d = ST3.div;
            // RPG Maker MZ の実際の描画領域に合わせる(400x240固定だとMZ標準816x624で
            // 疑似3Dが中央の小領域にしか生成されず、背景に埋もれやすい)。
            this._screenW = Math.max(1, Number(Graphics.boxWidth || Graphics.width || 816));
            this._screenH = Math.max(1, Number(Graphics.boxHeight || Graphics.height || 624));
            super.initialize(new Bitmap(Math.ceil(this._screenW / d), Math.ceil(this._screenH / d)));
            this.bitmap.smooth = false;                        // 荒く拡大する(ドット絵風・軽い)
            this.scale.set(d);
            this.visible = false;
            this.opacity = 0;
            this._active = false;
            this._z = 0;
            this._age = 0;
            this._frames = 1;
            this._loaded = {};
            this._defaults = {};
        }

        start(frames) {
            this._age = 0;
            this._frames = Math.max(1, frames);
            this._z = 0;
            this._active = true;
            this.visible = true;
        }

        // 画像(指定があり、読み込み済みならそれ。なければ自動の模様)
        texture(key, kind, fallbackKey) {
            const name = prm[key] || (fallbackKey && prm[fallbackKey]) || "";
            let bmp = null;
            if (name) {
                const k = name;
                if (!this._loaded[k]) this._loaded[k] = ImageManager.loadSystem(name);
                const b = this._loaded[k];
                if (b.isReady() && b.width > 0 && !b.isError()) bmp = b;
            }
            if (!bmp) bmp = this._defaults[kind] || (this._defaults[kind] = st3Default(kind));
            const el = ttElement(bmp);
            return { el, w: bmp.width, h: bmp.height, avg: st3Avg(bmp, el) };
        }

        update() {
            super.update();
            if (!this._active) return;
            this._age++;
            const t = rsClamp(this._age / this._frames, 0, 1);
            const fadeIn = rsClamp(this._age / ST3.fade, 0, 1);
            const fadeOut = rsClamp((this._frames - this._age) / ST3.fade, 0, 1);
            this.opacity = Math.round(255 * Math.min(fadeIn, fadeOut));
            // 進む速さ: ゆっくり出発 → 加速 → 減速して到着
            this._z += 0.085 * ST3.speed * (0.18 + Math.sin(Math.PI * t));
            this.render(this._z);
            if (this._age >= this._frames) {
                this._active = false;
                this.visible = false;
            }
        }

        render(camZ) {
            const bmp = this.bitmap, ctx = bmp.context, d = ST3.div;
            const W = bmp.width, H = bmp.height;
            const vx = W / 2;
            const vy = ST3.horizon / d + Math.sin(camZ * 5.5) * ST3.bob / d;   // 歩く上下の揺れ
            const f = Math.max(8, H - vy);                      // 焦点距離(最も手前の床が画面の下端に来る)
            const HC = 1, HW = vx / f, HCEIL = Math.max(0.2, vy / f);          // カメラの高さ・通路の半幅・天井の高さ
            ctx.save();
            ctx.clearRect(0, 0, W, H);

            // 遠景
            const back = this.texture("stage3dBackImage", "back");
            ctx.drawImage(back.el, 0, 0, back.w, back.h, 0, 0, W, H);

            // 天井(1行ずつ)
            const ceil = this.texture("stage3dCeilingImage", "ceiling");
            const TF = ST3.floorRepeat;
            for (let y = 0; y < Math.floor(vy); y++) {
                const o = vy - y;
                const z = f * HCEIL / o;
                const tilePx = o * TF / HCEIL;
                const row = Math.min(ceil.h - 1, Math.floor((((z + camZ) / TF) % 1 + 1) % 1 * ceil.h));
                this.drawRow(ctx, ceil, row, y, tilePx, vx, W);
            }
            // 床(1行ずつ)
            const floor = this.texture("stage3dFloorImage", "floor");
            for (let y = Math.floor(vy) + 1; y < H; y++) {
                const o = y - vy;
                const z = f * HC / o;
                const tilePx = o * TF / HC;
                const row = Math.min(floor.h - 1, Math.floor((((z + camZ) / TF) % 1 + 1) % 1 * floor.h));
                this.drawRow(ctx, floor, row, y, tilePx, vx, W);
            }

            // 左右の壁(1列ずつ。遠いほど低く、細かい)
            const wl = this.texture("stage3dWallLeftImage", "wall");
            const wr = this.texture("stage3dWallRightImage", "wall", "stage3dWallLeftImage");
            const WR = ST3.wallRepeat;
            for (let sx = 0; sx < Math.floor(vx); sx++) {
                const dx = vx - sx;
                const z = f * HW / dx;
                const u = ((((z + camZ) / WR) % 1) + 1) % 1;
                const yTop = vy - dx * HCEIL / HW, yBot = vy + dx * HC / HW;
                ctx.drawImage(wl.el, Math.min(wl.w - 1, Math.floor(u * wl.w)), 0, 1, wl.h, sx, yTop, 1.25, yBot - yTop);
                const sxr = W - 1 - sx;                              // 右の壁(鏡像の位置)
                ctx.drawImage(wr.el, Math.min(wr.w - 1, Math.floor(u * wr.w)), 0, 1, wr.h, sxr, yTop, 1.25, yBot - yTop);
            }

            // 霧(消失点に近いほど霧の色に溶け込む)
            const [r, g, b] = uiRgb(ST3.fog);
            const rad = Math.max(W, H) * 0.62;
            const fog = ctx.createRadialGradient(vx, vy, 0, vx, vy, rad);
            fog.addColorStop(0, "rgba(" + r + "," + g + "," + b + "," + ST3.fogStrength + ")");
            fog.addColorStop(0.5, "rgba(" + r + "," + g + "," + b + "," + (ST3.fogStrength * 0.3).toFixed(3) + ")");
            fog.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
            ctx.fillStyle = fog;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
            bmp._baseTexture.update();
        }

        // 1行ぶん(模様の1行を、その距離の大きさにして、横に並べる)
        drawRow(ctx, tex, row, y, tilePx, vx, W) {
            if (tilePx < 5) {                                    // 遠くて細かすぎる行は、平均色で塗る
                ctx.fillStyle = tex.avg;
                ctx.fillRect(0, y, W, 1);
                return;
            }
            let x = vx - Math.ceil(vx / tilePx) * tilePx;
            for (; x < W; x += tilePx) ctx.drawImage(tex.el, 0, row, tex.w, 1, x, y, tilePx + 0.6, 1);
        }
    }

    // 戦闘背景の直後(敵・味方の後ろ)に、疑似3Dの通路を差し込む
    Spriteset_Battle.prototype.startCorridor = function(frames) {
        if (!this._corridor) {
            this._corridor = new Sprite_Corridor3D();
            this._corridor.x = 0;
            this._corridor.y = 0;
            const back2 = this._back2Sprite;
            const index = back2 ? this._battleField.children.indexOf(back2) + 1 : 0;
            // 背景の直後、敵・味方の手前に置く。負のindexにならないよう防御する。
            this._battleField.addChildAt(this._corridor, Math.max(0, Math.min(index, this._battleField.children.length)));
        }
        this._corridor.start(frames);
    };

    class Sprite_StageDirector extends Sprite {
        initialize(scene, mode) {
            super.initialize();
            this._scene = scene;
            this._banner = null;
            this._layers = [];
            this._age = 0;
            this._steps = 0;
            this._swapped = false;
            if (mode === "intro") this.startIntro();
            else this.startClear();
        }

        // 帯 + 重ねる画像(帯の奥/手前)。画像は帯と一緒にフェードして消える
        setBanner(text, frames, skinKey, defs) {
            this.clearBanner();
            const back = new Sprite(), front = new Sprite();
            this._banner = new Sprite_StageBanner(text, frames, skinKey);
            this.addChild(back);
            this.addChild(this._banner);
            this.addChild(front);
            this._layers = [back, front];
            for (const def of defs) (def.layer === "front" ? front : back).addChild(new Sprite_RsDecor(def, 400, 240));
        }

        clearBanner() {
            for (const c of [this._banner].concat(this._layers)) if (c && c.parent) c.parent.removeChild(c);
            this._banner = null;
            this._layers = [];
        }

        startIntro() {
            this._step = "intro";
            this._age = 0;
            const text = ST.format.replace("{n}", BattleManager._stageIndex + 1).replace("{total}", BattleManager.stageTotal());
            this.setBanner(text, ST.introFrames, "stageBannerImage", ST.cutinImages);
            stagePlayJingle();
        }

        startClear() {
            this._step = "wait";                       // 最後の敵の消える演出が終わるのを待つ
            this._age = 0;
            this._walkFrames = ST.stepCount * ST.stepInterval + 24;
        }

        isSpritesetBusy() {
            const sp = this._scene._spriteset;
            return sp && ((sp.isBusy && sp.isBusy()) || (sp.isEffecting && sp.isEffecting()));
        }

        // 敵を左から順に出し、全員が現れ終わるまで戦闘を始めない
        startReveal() {
            this._step = "reveal";
            this._age = 0;
            this.clearBanner();
            const sp = this._scene._spriteset;
            if (sp && sp.revealEnemies) sp.revealEnemies(ST.revealGap);
        }

        update() {
            super.update();
            this._age++;
            if (this._banner) for (const layer of this._layers) layer.opacity = this._banner.opacity;
            if (this._step === "wait") {
                if (this._age > 20 && (!this.isSpritesetBusy() || this._age > 100)) {
                    if (ST.clearBanner && ST.clearText) {
                        this._step = "clear";
                        this._age = 0;
                        this.setBanner(ST.clearText, 54, "stageClearImage", ST.clearImages);
                        stagePlaySe({ name: "", volume: 0, pitch: 100, pan: 0 }, stageSynthJingle);
                    } else this.startWalk();
                }
            } else if (this._step === "clear") {
                if (this._age >= 54) { this.clearBanner(); this.startWalk(); }
            } else if (this._step === "walk") {
                this.updateWalk();
            } else if (this._step === "intro") {
                if (this._age >= ST.introFrames) this.startReveal();
            } else if (this._step === "reveal") {
                const sp = this._scene._spriteset;
                const done = !sp || (!sp.isRevealing() && !(sp.isEffecting && sp.isEffecting()));
                if ((this._age > 4 && done) || this._age > 300) this.finish();
            }
        }

        startWalk() {
            this._step = "walk";
            this._age = 0;
            this._steps = 0;
            BattleManager._stageWalking = true;
            const sp0 = this._scene._spriteset;
            if (ST3.enabled && sp0 && sp0.startCorridor) sp0.startCorridor(this._walkFrames);      // 奥へ進む疑似3D
            for (const m of $gameParty.members()) if (m.requestMotion) m.requestMotion("walk");
        }

        updateWalk() {
            const t = this._age / this._walkFrames;
            // 足音(1歩ごと)
            if (this._age % ST.stepInterval === 1 && this._steps < ST.stepCount) {
                const variant = this._steps % 2;
                stagePlaySe(ST.stepSe, () => stageSynthStep(variant));
                this._steps++;
            }
            // 背景を横へ流す(歩き始めと終わりは緩やかに)
            const sp = this._scene._spriteset;
            if (sp && ST.scroll && !ST3.enabled) {
                const v = ST.scroll * Math.sin(Math.PI * rsClamp(t, 0, 1));
                for (const b of [sp._back1Sprite, sp._back2Sprite]) if (b && b.origin) b.origin.x += v;
            }
            // 歩く途中で次の敵グループに切り替える(敵のスプライトは、表示の演出が終わるまで出さない)
            if (!this._swapped && t >= 0.55) {
                this._swapped = true;
                BattleManager.nextStage();
            }
            if (this._age >= this._walkFrames) {
                BattleManager._stageWalking = false;
                stageStopSteps();                      // 足音はここで切る
                for (const m of $gameParty.members()) if (m.requestMotion) m.requestMotion("wait");
                this.startIntro();                     // 次のステージの表示とジングル
            }
        }

        finish() {
            stageStopSteps();
            BattleManager._stageBusy = false;
            this.clearBanner();
            if (this.parent) this.parent.removeChild(this);
            this._scene._stageDirector = null;
        }
    }

    Scene_Battle.prototype.startStageDirector = function(mode) {
        if (this._stageDirector && this._stageDirector.parent) this._stageDirector.parent.removeChild(this._stageDirector);
        this._stageDirector = new Sprite_StageDirector(this, mode);
        this.addChild(this._stageDirector);
    };
    const _Scene_Battle_start_st = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        _Scene_Battle_start_st.call(this);
        if (BattleManager._stageActive && BattleManager._stageIndex === 0 && !this._stageDirector) {
            this.startStageDirector("intro");          // 「STAGE 1/N」+ ジングルのあと、そのまま戦闘へ
        }
    };

    //-------------------------------------------------------------------------
    // 敵のHPゲージ(敵スプライトの子。敵の拡大縮小に左右されない大きさ)
    //-------------------------------------------------------------------------
    const EH = {
        enabled: prm.enemyHpEnabled !== "false",
        mode: prm.enemyHpMode || "always",
        pos: prm.enemyHpPosition || "below",
        w: Math.max(8, Number(prm.enemyHpWidth || 44)),
        h: Math.max(2, Number(prm.enemyHpHeight || 5)),
        offY: Number(prm.enemyHpOffsetY ?? 4),
        fixedToHud: prm.enemyHpFixedToHud !== "false",
        hudOffsetY: Number(prm.enemyHpHudOffsetY ?? -6),
        name: prm.enemyHpShowName === "true"
    };

    class Sprite_EnemyHp extends Sprite {
        initialize(enemySprite) {
            const nameH = EH.name ? 14 : 0;
            super.initialize(new Bitmap(EH.w + 6, EH.h + nameH + 6));
            this._es = enemySprite;
            this._nameH = nameH;
            this._shown = 1;
            this._ghost = 1;
            this._fade = 0;
            this._key = "";
            this._imgVer = -1;
            this.anchor.set(0.5, 0);
            this.opacity = 0;
        }

        draw(enemy, ratio, ghost) {
            const bmp = this.bitmap, ctx = bmp.context, W = bmp.width;
            bmp.clear();
            const bx = 3, by = 3 + this._nameH, bw = EH.w, bh = EH.h;
            if (EH.name) rsText(bmp, enemy.name(), 0, 0, W, 11, "center", "#ffffff");
            const back = rsSkin("enemyHpBackImage");
            if (back) rsBlit(bmp, back, bx, by, bw, bh);
            else if (back === undefined) {
                ctx.fillStyle = UI.solid ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.62)";
                rsRoundRect(ctx, bx, by, bw, bh, bh / 2);
                ctx.fill();
            }
            const fill = rsSkin("enemyHpFillImage");
            if (fill === undefined && ghost > ratio + 0.002) {            // 遅れて減る明るいゲージ
                ctx.save();
                rsRoundRect(ctx, bx, by, bw, bh, bh / 2);
                ctx.clip();
                ctx.fillStyle = "#ffd9a0";
                ctx.fillRect(bx, by, Math.max(bh, bw * ghost), bh);
                ctx.restore();
            }
            if (ratio > 0) {
                if (fill) {
                    bmp.blt(fill, 0, 0, Math.max(1, Math.round(fill.width * ratio)), fill.height,
                        bx, by, Math.max(1, Math.round(bw * ratio)), bh);
                } else if (fill === undefined) {
                    ctx.save();
                    rsRoundRect(ctx, bx, by, bw, bh, bh / 2);
                    ctx.clip();
                    const low = ratio <= 0.25;
                    const g = ctx.createLinearGradient(0, by, 0, by + bh);
                    g.addColorStop(0, UI.solid ? (low ? "#ff8a5a" : "#ff6a3a") : (low ? "#ffb08a" : "#ff8a7a"));
                    g.addColorStop(1, UI.solid ? (low ? "#c8321a" : "#c8421a") : (low ? "#e0402a" : "#e03a3a"));
                    ctx.fillStyle = g;
                    ctx.fillRect(bx, by, Math.max(bh, bw * ratio), bh);
                    ctx.fillStyle = UI.solid ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)";
                    ctx.fillRect(bx, by, Math.max(bh, bw * ratio), Math.max(1, bh * 0.35));
                    ctx.restore();
                }
            }
            const frame = rsSkin("enemyHpFrameImage");
            if (frame) rsBlit(bmp, frame, bx, by, bw, bh);
            else if (frame === undefined && back === undefined && fill === undefined) {
                ctx.strokeStyle = UI.solid ? UI.accent : "rgba(255,255,255,0.7)";
                ctx.lineWidth = 1;
                rsRoundRect(ctx, bx + 0.5, by + 0.5, bw - 1, bh - 1, bh / 2);
                ctx.stroke();
            }
            bmp._baseTexture.update();
        }

        update() {
            super.update();
            const es = this._es, enemy = es && es._enemy;
            if (!enemy) { this.opacity = 0; return; }
            if (this._imgVer !== rsImgVer) { this._imgVer = rsImgVer; this._key = ""; }
            const ratio = enemy.mhp > 0 ? enemy.hp / enemy.mhp : 0;
            this._shown += Math.max(-0.03, Math.min(0.03, ratio - this._shown));
            if (this._ghost > this._shown) this._ghost = Math.max(this._shown, this._ghost - 0.004);
            else this._ghost = this._shown;
            const visible = enemy.isAlive() && !enemy.isHidden() && (EH.mode === "always" || ratio < 0.9999);
            this._fade += Math.max(-0.1, Math.min(0.1, (visible ? 1 : 0) - this._fade));
            this.opacity = Math.round(255 * this._fade);
            // 敵の拡大縮小を打ち消して、HPバー自体は常に同じ大きさで表示する。
            const sx = Math.abs(es.scale.x) || 1, sy = Math.abs(es.scale.y) || 1;
            this.scale.set(1 / sx, 1 / sy);
            const H = this.bitmap.height;
            this.x = 0;
            if (EH.fixedToHud && es.parent) {
                // 立ち絵HUDの上端を基準に、HPバーの表示Yを固定する。
                const hud = es.parent._hud;
                const hudTop = hud ? hud._y0 : (Graphics.uiBox("top").height - 100 - 2);
                const targetY = hudTop + EH.hudOffsetY;
                // Sprite_EnemyHp は Sprite_Enemy の子なので、親のscaleを打ち消したローカル座標にする。
                this.y = (targetY - es.y) / sy;
            } else {
                this.y = EH.pos === "above"
                    ? -((es.bitmap && es.bitmap.height) || 0) - (EH.offY + H) / sy
                    : EH.offY / sy;
            }
            const key = [Math.round(this._shown * 400), Math.round(this._ghost * 400), enemy.name()].join("|");
            if (key !== this._key) {
                this._key = key;
                this.draw(enemy, this._shown, this._ghost);
            }
        }
    }
    const _SE_initMembers_eh = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _SE_initMembers_eh.call(this);
        if (EH.enabled) {
            this._hpGauge = new Sprite_EnemyHp(this);
            this.addChild(this._hpGauge);
        }
    };

    // UIの文字を、対象ごとにカテゴリ分け(フォント・色の指定を、対象ごとに効かせる)
    uiCategorize(Sprite_TitleButton, "title", ["makeGenerated"]);
    uiCategorize(Sprite_RsBanner, "result", ["draw"]);
    uiCategorize(Sprite_RsCard, "result", ["refresh"]);
    uiCategorize(Sprite_RsRewards, "result", ["refresh"]);
    uiCategorize(Sprite_RsNextButton, "result", ["build"]);
    uiCategorize(Sprite_RecruitUi, "recruit", ["initialize", "drawText", "drawInfo"]);
    uiCategorize(Sprite_RecruitButton, "recruit", ["build"]);
    uiCategorize(Sprite_StageBanner, "stage", ["draw"]);
    uiCategorize(Sprite_StageIndicator, "stage", ["update"]);
    uiCategorize(Sprite_SkillBanner, "skill", ["initialize", "redraw"]);
    uiCategorize(Sprite_EnemyHp, "enemy", ["draw"]);

    //-------------------------------------------------------------------------
    // TouchInput : 画面判定 / ローカル座標
    //-------------------------------------------------------------------------
    TouchInput.screen = function() {
        if (Graphics.screenRect("top").contains(this.x, this.y)) return "top";
        if (Graphics.screenRect("bottom").contains(this.x, this.y)) return "bottom";
        return null;
    };

    TouchInput.localPosition = function(type) {
        const r = Graphics.screenRect(type);
        return new Point(this.x - r.x, this.y - r.y);
    };

    const _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return _Scene_Map_isMapTouchOk.call(this) &&
            (!CFG.mapTouchTopOnly || TouchInput.y < CFG.topH);
    };

    //-------------------------------------------------------------------------
    // プラグインコマンド
    //-------------------------------------------------------------------------
    PluginManager.registerCommand(PN, "setScreenVisible", args => {
        const scene = SceneManager._scene;
        if (scene && scene.setScreenVisible) {
            scene.setScreenVisible(args.screen === "top" ? "top" : "bottom", args.visible !== "false");
        }
    });

    //-------------------------------------------------------------------------
    // バトルホイール(YW_BattleWheel 統合)
    //   上画面 : 前衛アクターの配置 + 敵
    //   下画面 : ホイール(座標は下画面の左上が原点)
    //-------------------------------------------------------------------------
    function installBattleWheel() {
        "use strict";
        const P = prm;
        const WX = Number(P.wheelX ?? 160);
        const WY = Number(P.wheelY ?? 120);
        const WR = Number(P.wheelRadius ?? 62);
        const FR = Number(P.faceRadius ?? 22);
        const ROW_X = Number(P.rowX ?? 196);
        const ROW_Y = Number(P.rowY ?? 200);
        const RX = Number(P.rowWidth ?? 100);
        const RY = Number(P.rowDepth ?? 14);
        const WHEEL_IMAGE = String(P.wheelImage || "");
        const FIT_IMAGE = P.fitImage !== "false";
        const FRONT_ZONE = P.frontZone !== "false";
        const HP_GRADIENT = P.hpGradient !== "false";
        const FACE_STYLE = String(P.faceStyle || "icon");
        const PORTRAIT_SIZE = Number(P.portraitSize ?? 60);
        const HUB_R = Math.round(WR * 0.36);
        const SECTOR_COLORS = (() => {
            const def = ["#f7a531", "#9ad64a", "#33b8ea", "#8c6ee6", "#ee5f80", "#f2d443"];
            try {
                const a = JSON.parse(P.sectorColors || "[]");
                return Array.isArray(a) && a.length ? a : def;
            } catch (e) {
                return def;
            }
        })();

        const DISC_R = WR + FR + 16;
        const RING_W = 9;
        const RING_R = WR + FR + 9;
        const RING_HALF = Math.ceil(RING_R + RING_W / 2 + 3);
        const RING_GAP = 3 * Math.PI / 180;

        const N = 6;
        const FRONT = 3;
        const STEP = Math.PI / 3;

        let wheelRot = 0;
        let wheelDragging = false;
        let wazaBusy = false;          // わざ(キャラ選択/ゲージ)中は戦闘時間とホイール操作を止める

        Game_Party.prototype.wheelMembers = function() {
            return this.allMembers().slice(0, N);
        };

        Game_Party.prototype.wheelOffset = function() {
            return this._wheelOffset || 0;
        };

        Game_Party.prototype.setWheelOffset = function(v) {
            this._wheelOffset = ((Math.round(v) % N) + N) % N;
        };

        Game_Party.prototype.wheelSlot = function(actor) {
            const i = this.wheelMembers().indexOf(actor);
            if (i < 0) return -1;
            return (i + this.wheelOffset()) % N;
        };

        Game_Party.prototype.maxBattleMembers = function() {
            return FRONT;
        };

        Game_Party.prototype.battleMembers = function() {
            return this.wheelMembers()
                .filter(a => this.wheelSlot(a) < FRONT && a.isAppeared())
                .sort((a, b) => this.wheelSlot(a) - this.wheelSlot(b));
        };

        const _isAllDead = Game_Party.prototype.isAllDead;
        Game_Party.prototype.isAllDead = function() {
            if (this.inBattle()) return this.wheelMembers().every(a => a.isDead());
            return _isAllDead.call(this);
        };

        Game_Actor.prototype.isAutoBattle = function() {
            return true;
        };

        const _BM_setup = BattleManager.setup;
        BattleManager.setup = function(troopId, canEscape, canLose) {
            $gameParty.setWheelOffset(0);
            wheelRot = 0;
            wheelDragging = false;
            _BM_setup.call(this, troopId, canEscape, canLose);
        };

        // ホイールを掴んでいる間はTPBを止める。
        const _BM_updateTpb = BattleManager.updateTpb;
        BattleManager.updateTpb = function() {
            if (wheelDragging || wazaBusy) return;
            _BM_updateTpb.call(this);
        };

        // 行動開始直前にも前衛か確認。後衛ならその行動を捨てる。
        const _BM_startAction = BattleManager.startAction;
        BattleManager.startAction = function() {
            const subject = this._subject;
            if (subject && subject.isActor && subject.isActor() &&
                !$gameParty.battleMembers().includes(subject)) {
                subject.clearActions();
                this._subject = null;
                return;
            }
            _BM_startAction.call(this);
        };

        function clearBackRowActions() {
            const front = $gameParty.battleMembers();
            for (const actor of $gameParty.wheelMembers()) {
                if (!front.includes(actor)) actor.clearActions();
            }
            if (BattleManager._actionBattlers) {
                BattleManager._actionBattlers = BattleManager._actionBattlers.filter(b =>
                    !b || !b.isActor || !b.isActor() || front.includes(b)
                );
            }
        }

        const actorAngle = actor => {
            const i = $gameParty.wheelMembers().indexOf(actor);
            return (i - 1 + wheelRot) * STEP;
        };

        Spriteset_Battle.prototype.createActors = function() {
            this._actorSprites = [];
            for (let i = 0; i < N; i++) {
                const sprite = new Sprite_Actor();
                this._actorSprites.push(sprite);
                this._battleField.addChild(sprite);
            }
            if (HUD.enabled) {
                // 立ち絵HUD(SVキャラの上に重ね、SVキャラ自体は隠す)
                this._hud = new Sprite_BattleHud();
                this._battleField.addChild(this._hud);
                this._battleField._hud = this._hud;
            }
        };

        Spriteset_Battle.prototype.updateActors = function() {
            const members = $gameParty.wheelMembers();
            for (let i = 0; i < this._actorSprites.length; i++) {
                this._actorSprites[i].setBattler(members[i]);
            }
        };

        const _SA_update = Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update = function() {
            if (this._actor && $gameParty.inBattle()) {
                if (HUD.enabled) {
                    // 立ち絵HUDの位置に合わせる(ダメージ表示や戦闘アニメがここに出る)
                    const hud = this.parent && this.parent._hud;
                    const pos = hud ? hud.actorAnchor(this._actor) : null;
                    this._homeX = pos ? pos.x : ROW_X;
                    this._homeY = pos ? pos.y : ROW_Y;
                    this.alpha = 1;
                } else {
                    const a = actorAngle(this._actor);
                    this._homeX = ROW_X + Math.sin(a) * RX;
                    this._homeY = ROW_Y - Math.cos(a) * RY;
                    this.alpha = Math.max(0, Math.min(1, Math.cos(a) / 0.5));
                }
            }
            _SA_update.call(this);
            if (HUD.enabled) {
                // SVキャラの見た目だけ隠す(位置の更新は続ける)
                if (this._mainSprite) this._mainSprite.visible = false;
                if (this._shadowSprite) this._shadowSprite.visible = false;
                if (this._weaponSprite) this._weaponSprite.visible = false;
                if (this._stateSprite) this._stateSprite.visible = false;
            }
        };

        Sprite_Actor.prototype.setActorHome = function(index) {};

        //-------------------------------------------------------------------------
        // 立ち絵HUD: SVキャラの代わりに「立ち絵 + 名前 + HP + スタミナ」を上画面の下に表示
        //-------------------------------------------------------------------------
        const HUD = {
            enabled: P.hudEnabled !== "false",
            numbers: P.hudShowNumbers !== "false",
            fx: P.hudFx !== "false",
            cardBg: P.hudCardBgEnabled === "true",
            offX: Number(P.hudOffsetX || 0),
            offY: Number(P.hudOffsetY || 0),
            spacing: Number(P.hudSpacing ?? 6),
            portraitH: Math.max(8, Number(P.hudPortraitHeight || 92))
        };
        const HUD_W = 120, HUD_H = 100;
        const HUD_ACTORS = {};
        parseJson(P.hudActors, []).forEach(str => {
            const d = parseJson(str, null);
            if (d && d.actorId) HUD_ACTORS[Number(d.actorId)] = d;
        });
        // アクターごとの立ち絵設定(構造体 > メモ欄)
        const hudDefOf = actor => {
            const note = (actor.actor() && actor.actor().note) || "";
            // 仲間にして生成したアクターは、元のテンプレートの立ち絵設定を引き継ぐ
            const tm = /<RecruitTemplate\s*:\s*(\d+)\s*>/i.exec(note);
            const d = HUD_ACTORS[actor.actorId()] || (tm ? HUD_ACTORS[Number(tm[1])] : null) || {};
            const m = /<(?:立ち絵|HudImage)\s*:\s*([^>\s]+)\s*>/i.exec(note);
            const em = /<立ち絵敵\s*:\s*([^>\s]+)\s*>/i.exec(note);      // 敵の戦闘画像を立ち絵にする
            return {
                image: d.image || (m ? m[1] : (em ? "enemy:" + em[1] : "")),
                imageAction: d.imageAction || "",
                imageDamage: d.imageDamage || "",
                imageLowHp: d.imageLowHp || "",
                imageDead: d.imageDead || "",
                ox: rsNum(d.offsetX, 0),
                oy: rsNum(d.offsetY, 0),
                scale: Math.max(0.01, rsNum(d.scale, 100) / 100)
            };
        };
        // 立ち絵の読み込み: Bitmap=表示可 / false=読み込み中 / null=指定なし・失敗
        const hudPictureCache = {};
        const hudPicture = name => {
            if (!name) return null;
            if (!(name in hudPictureCache)) {
                const b = name.startsWith("enemy:") ? ImageManager.loadEnemy(name.slice(6)) : ImageManager.loadPicture(name);
                b.addLoadListener(() => { rsImgVer++; });
                hudPictureCache[name] = b;
            }
            const b = hudPictureCache[name];
            if (b.isError()) return null;
            return b.isReady() && b.width > 0 ? b : false;
        };

        class Sprite_HudCard extends Sprite {
            initialize(slot, baseX, baseY) {
                super.initialize();
                this._slot = slot;
                this._baseX = baseX;
                this._baseY = baseY;
                this.pivot.set(HUD_W / 2, HUD_H);                 // 足元中央を基準に浮かせる
                this.x = baseX + HUD_W / 2;
                this.y = baseY + HUD_H;
                this._actor = null;
                this._age = 0;
                this._imgVer = -1;
                this._raise = 0;
                this._shake = 0;
                this._flash = 0;
                this._hitAge = 999;
                this._swap = 0;
                this._slideAlpha = 1;
                this._hpShown = 0;
                this._hpGhost = 0;
                this._stShown = 0;
                this._lastHp = 0;
                this._key = "";
                this._portraitKey = "";
                this._faceBmp = null;
                this._back = new Sprite(new Bitmap(HUD_W, HUD_H));
                this.addChild(this._back);
                this._portrait = new Sprite();
                this._portrait.anchor.set(0.5, 1);
                this._portrait.setBlendColor([0, 0, 0, 0]);
                this.addChild(this._portrait);
                this._plate = new Sprite(new Bitmap(HUD_W, HUD_H));
                this.addChild(this._plate);
                this._glow = new Sprite(new Bitmap(HUD_W, HUD_H));
                this._glow.blendMode = 1;                          // 加算合成
                this._glow.opacity = 0;
                this.addChild(this._glow);
                this.visible = false;
            }

            setActor(actor) {
                if (actor === this._actor) return;
                this._actor = actor;
                this._swap = 0;                                    // 入れ替わりはフェードで
                this._key = "";
                this._portraitKey = "";
                this._faceBmp = null;
                this._hitAge = 999;
                if (actor) {
                    this._hpShown = this._hpGhost = actor.mhp > 0 ? actor.hp / actor.mhp : 0;
                    this._stShown = actor.battleStaminaRate ? actor.battleStaminaRate() : 0;
                    this._lastHp = actor.hp;
                }
            }

            // ----- 立ち絵の選択(戦闘不能 > 被弾 > 行動中 > 瀕死 > 通常) -----
            pickName(def, actor) {
                if (actor.isDead() && def.imageDead) return def.imageDead;
                if (this._hitAge < 30 && def.imageDamage) return def.imageDamage;
                if (actor.isActing && actor.isActing() && def.imageAction) return def.imageAction;
                if (actor.mhp > 0 && actor.hp / actor.mhp <= 0.25 && def.imageLowHp) return def.imageLowHp;
                return def.image;
            }

            updatePortrait(actor) {
                const def = hudDefOf(actor);
                const name = this.pickName(def, actor);
                let bmp = hudPicture(name);
                if (bmp === false) bmp = hudPicture(def.image);              // 読み込み中は通常の立ち絵で代用
                const key = (bmp ? name : "face") + "|" + rsImgVer;
                if (key !== this._portraitKey) {
                    this._portraitKey = key;
                    const p = this._portrait;
                    if (bmp) {
                        const k = (HUD.portraitH / bmp.height) * def.scale;
                        p.bitmap = bmp;
                        p.scale.set(k);
                        p.x = 30 + def.ox;
                        p.y = HUD_H - 2 + def.oy;
                    } else {
                        // 立ち絵がない: 顔グラフィックを枠つきで表示
                        if (!this._faceBmp) this._faceBmp = this.makeFace(actor);
                        p.bitmap = this._faceBmp;
                        p.scale.set(1);
                        p.x = 30;
                        p.y = HUD_H - 4;
                    }
                }
                // 戦闘不能は灰色 / 被弾は赤く光る
                const dead = actor.isDead();
                this._portrait.setColorTone(dead ? [0, 0, 0, 255] : [0, 0, 0, 0]);
                const f = this._flash;
                this._portrait.setBlendColor(f > 0 ? [255, 40, 40, Math.round(140 * f)] : [0, 0, 0, 0]);
            }

            makeFace(actor) {
                const bmp = new Bitmap(64, 64);
                const face = ImageManager.loadFace(actor.faceName());
                const draw = () => {
                    const ctx = bmp.context;
                    bmp.clear();
                    ctx.save();
                    rsRoundRect(ctx, 4, 4, 56, 56, 8);
                    ctx.fillStyle = "rgba(0,0,0,0.45)";
                    ctx.fill();
                    ctx.clip();
                    if (face.width > 0) {
                        const idx = actor.faceIndex();
                        ctx.drawImage(ttElement(face), (idx % 4) * 144, Math.floor(idx / 4) * 144, 144, 144, 4, 4, 56, 56);
                    }
                    ctx.restore();
                    const frame = rsSkin("hudPortraitFrameImage");
                    if (frame) {
                        rsBlit(bmp, frame, 0, 0, 64, 64);
                    } else if (frame === undefined) {
                        rsRoundRect(ctx, 4, 4, 56, 56, 8);
                        ctx.strokeStyle = "rgba(255,255,255,0.9)";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                    bmp._baseTexture.update();
                };
                face.addLoadListener(draw);
                return bmp;
            }

            // ----- ゲージ1本(背景/中身/枠 それぞれ 画像 > 自動) -----
            drawBar(bmp, ctx, x, y, w, h, ratio, ghost, keys, c1, c2) {
                const back = rsSkin(keys.back);
                if (back) rsBlit(bmp, back, x, y, w, h);
                else if (back === undefined) {
                    ctx.fillStyle = "rgba(0,0,0,0.62)";
                    rsRoundRect(ctx, x, y, w, h, h / 2);
                    ctx.fill();
                }
                const fill = rsSkin(keys.fill);
                if (fill === undefined && ghost > ratio + 0.002) {      // 遅れて減る赤いゲージ
                    ctx.save();
                    rsRoundRect(ctx, x, y, w, h, h / 2);
                    ctx.clip();
                    ctx.fillStyle = "#ff6a5a";
                    ctx.fillRect(x, y, Math.max(h, w * ghost), h);
                    ctx.restore();
                }
                if (ratio > 0) {
                    if (fill) {
                        bmp.blt(fill, 0, 0, Math.max(1, Math.round(fill.width * ratio)), fill.height,
                            x, y, Math.max(1, Math.round(w * ratio)), h);
                    } else if (fill === undefined) {
                        ctx.save();
                        rsRoundRect(ctx, x, y, w, h, h / 2);
                        ctx.clip();
                        const g = ctx.createLinearGradient(0, y, 0, y + h);
                        g.addColorStop(0, c1);
                        g.addColorStop(1, c2);
                        ctx.fillStyle = g;
                        ctx.fillRect(x, y, Math.max(h, w * ratio), h);
                        ctx.fillStyle = UI.solid ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)";
                        ctx.fillRect(x, y, Math.max(h, w * ratio), Math.max(1, h * 0.35));
                        ctx.restore();
                    }
                }
                const frame = rsSkin(keys.frame);
                if (frame) rsBlit(bmp, frame, x, y, w, h);
                else if (frame === undefined && back === undefined && fill === undefined) {
                    ctx.strokeStyle = "rgba(255,255,255,0.6)";
                    ctx.lineWidth = 1;
                    rsRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, h / 2);
                    ctx.stroke();
                }
            }

            // ----- 名前プレート + HP + スタミナ -----
            drawPlate(actor) {
                const bmp = this._plate.bitmap, ctx = bmp.context;
                bmp.clear();
                const px = 44, py = HUD_H - 38, pw = 74, ph = 14;
                const plate = rsSkin("hudNamePlateImage");
                if (plate) rsBlit(bmp, plate, px, py, pw, ph);
                else if (plate === undefined) {
                    rsRoundRect(ctx, px, py, pw, ph, 4);
                    const g = ctx.createLinearGradient(0, py, 0, py + ph);
                    g.addColorStop(0, UI.solid ? "rgba(30,33,41,0.94)" : "rgba(30,40,70,0.92)");
                    g.addColorStop(1, UI.solid ? "rgba(8,9,12,0.94)" : "rgba(8,12,30,0.92)");
                    ctx.fillStyle = g;
                    ctx.fill();
                    ctx.fillStyle = UI.solid ? UI.accent : "#e8c860";
                    ctx.fillRect(px + 2, py + ph - 1.5, pw - 4, 1.5);
                }
                bmp._baseTexture.update();
                rsText(bmp, actor.name(), px + 5, py - 2, pw - 8, 11, "left");

                const hpRate = actor.mhp > 0 ? actor.hp / actor.mhp : 0;
                const low = hpRate <= 0.25;
                // HP
                const hy = HUD_H - 24;
                const hIcon = rsSkin("hudHpIconImage");
                if (hIcon) rsBlit(bmp, hIcon, 44, hy - 1, 10, 10);
                else if (hIcon === undefined) {
                    ctx.fillStyle = low ? "#ff6a5a" : "#ff9ab0";             // ハート
                    ctx.beginPath();
                    ctx.moveTo(49, hy + 8);
                    ctx.bezierCurveTo(43, hy + 3, 45, hy - 1, 49, hy + 2);
                    ctx.bezierCurveTo(53, hy - 1, 55, hy + 3, 49, hy + 8);
                    ctx.fill();
                }
                this.drawBar(bmp, ctx, 56, hy, 62, 8, this._hpShown, this._hpGhost,
                    { back: "hudHpBackImage", fill: "hudHpFillImage", frame: "hudHpFrameImage" },
                    UI.solid ? (low ? "#ff9a6a" : "#a6ee62") : (low ? "#ffb08a" : "#6af0dc"),
                    UI.solid ? (low ? "#d63a1e" : "#4fae22") : (low ? "#e0402a" : "#16a8c0"));
                // スタミナ
                const sy = HUD_H - 13;
                const sIcon = rsSkin("hudStIconImage");
                if (sIcon) rsBlit(bmp, sIcon, 44, sy - 2, 10, 10);
                else if (sIcon === undefined) {
                    ctx.strokeStyle = "#f2c84a";                              // 歯車
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(49, sy + 3, 3.2, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.lineWidth = 1.6;
                    for (let k = 0; k < 8; k++) {
                        const a = k * Math.PI / 4;
                        ctx.beginPath();
                        ctx.moveTo(49 + Math.cos(a) * 4.2, sy + 3 + Math.sin(a) * 4.2);
                        ctx.lineTo(49 + Math.cos(a) * 5.4, sy + 3 + Math.sin(a) * 5.4);
                        ctx.stroke();
                    }
                }
                this.drawBar(bmp, ctx, 56, sy, 54, 6, this._stShown, this._stShown,
                    { back: "hudStBackImage", fill: "hudStFillImage", frame: "hudStFrameImage" },
                    "#ffe27a", "#e0a020");
                bmp._baseTexture.update();
                if (HUD.numbers) rsText(bmp, String(Math.max(0, actor.hp)), 56, hy - 4, 60, 8, "right", "#ffffff", "rgba(0,30,40,0.95)");
                // エンブレム(画像のみ)
                const emblem = rsSkin("hudEmblemImage");
                if (emblem) rsBlit(bmp, emblem, 0, HUD_H - 20, 18, 18);
                bmp._baseTexture.update();
            }

            drawBack() {
                const bmp = this._back.bitmap, ctx = bmp.context;
                bmp.clear();
                const skin = rsSkin("hudCardImage");
                if (skin) rsBlit(bmp, skin, 0, 0, HUD_W, HUD_H);
                else if (skin === undefined && HUD.cardBg) {
                    rsRoundRect(ctx, 0, HUD_H - 46, HUD_W, 44, 8);
                    const g = ctx.createLinearGradient(0, HUD_H - 46, 0, HUD_H);
                    g.addColorStop(0, "rgba(10,20,50,0.0)");
                    g.addColorStop(1, "rgba(10,20,50,0.6)");
                    ctx.fillStyle = g;
                    ctx.fill();
                }
                bmp._baseTexture.update();
            }

            drawGlow() {
                const bmp = this._glow.bitmap, ctx = bmp.context;
                bmp.clear();
                const skin = rsSkin("hudFocusImage");
                if (skin) rsBlit(bmp, skin, 0, 0, HUD_W, HUD_H);
                else if (skin === undefined) {
                    ctx.save();
                    ctx.strokeStyle = "rgba(255,230,120,1)";
                    ctx.shadowColor = "#fff2a0";
                    ctx.shadowBlur = 10;
                    ctx.lineWidth = 2.5;
                    for (let i = 0; i < 2; i++) {
                        rsRoundRect(ctx, 42, HUD_H - 42, 78, 40, 8);
                        ctx.stroke();
                    }
                    ctx.restore();
                }
                bmp._baseTexture.update();
            }

            update() {
                super.update();
                const actor = this._actor;
                if (!actor) { this.visible = false; return; }
                this.visible = this._slideAlpha > 0.01;
                this._age++;
                if (this._imgVer !== rsImgVer) {
                    this._imgVer = rsImgVer;
                    this._key = "";
                    this._portraitKey = "";
                    this.drawBack();
                    this.drawGlow();
                }
                // 被弾の検出(HPが減った)
                if (actor.hp < this._lastHp) {
                    this._hitAge = 0;
                    if (HUD.fx) { this._shake = 12; this._flash = 1; }
                }
                this._lastHp = actor.hp;
                this._hitAge++;

                // ゲージの追従(HPは遅れて減る赤いゲージつき)
                const hpRate = actor.mhp > 0 ? actor.hp / actor.mhp : 0;
                const stRate = actor.battleStaminaRate ? actor.battleStaminaRate() : 0;
                const sp = HUD.fx ? 0.03 : 1;
                this._hpShown += Math.max(-sp, Math.min(sp, hpRate - this._hpShown));
                if (this._hpGhost > this._hpShown) this._hpGhost = Math.max(this._hpShown, this._hpGhost - (HUD.fx ? 0.004 : 1));
                else this._hpGhost = this._hpShown;
                this._stShown += Math.max(-0.02, Math.min(0.02, stRate - this._stShown));

                // 行動中は浮いて光る / 被弾で揺れる
                const acting = HUD.fx && ((actor.isActing && actor.isActing()) || BattleManager._subject === actor);
                this._raise += Math.max(-0.12, Math.min(0.12, (acting ? 1 : 0) - this._raise));
                if (this._shake > 0) this._shake--;
                if (this._flash > 0) this._flash = Math.max(0, this._flash - 0.06);
                this._swap = Math.min(1, this._swap + 0.1);
                this.alpha = this._swap * this._slideAlpha * (actor.isDead() ? 0.75 : 1);
                this.x = this._baseX + HUD_W / 2 + (this._shake > 0 ? Math.sin(this._shake * 2.2) * this._shake * 0.5 : 0);
                this.y = this._baseY + HUD_H - 6 * this._raise;
                if (BattleManager._stageWalking) this.y -= Math.abs(Math.sin(this._age * 0.32 + this._slot * 1.7)) * 4;   // ステージ間で歩くときの上下の揺れ
                this.scale.set(1 + 0.04 * this._raise);
                this._glow.opacity = Math.round(255 * this._raise * (0.7 + 0.3 * Math.sin(this._age / 5)));

                this.updatePortrait(actor);
                const key = [actor.actorId(), actor.name(), Math.round(this._hpShown * 400), Math.round(this._hpGhost * 400),
                    Math.round(this._stShown * 400), actor.hp, actor.mhp, this._imgVer].join("|");
                if (key !== this._key) {
                    this._key = key;
                    this.drawPlate(actor);
                }
            }
        }

        // 全メンバーぶんのカード。ホイールの回転に合わせて横にスライドする
        //   前衛3人(左・中・右)が見える位置。外へ出ていくカードはフェードアウト、入ってくるカードはフェードインする
        class Sprite_BattleHud extends Sprite {
            initialize() {
                super.initialize();
                const box = Graphics.uiBox("top");
                this._cx = box.width / 2 + HUD.offX;                       // 中央のカードの中心X
                this._step = HUD_W + HUD.spacing;                          // 隣のカードまでの距離
                this._y0 = box.height - HUD_H - 2 + HUD.offY;
                this._cards = [];
                for (let i = 0; i < N; i++) {
                    const card = new Sprite_HudCard(i, this._cx - HUD_W / 2, this._y0);
                    this.addChild(card);
                    this._cards.push(card);
                }
            }

            // ホイール上の角度(60°ごとに1枚ぶん)を、横方向の位置に直す
            layoutCards() {
                const members = $gameParty.wheelMembers();
                const front = Math.PI / 3, fade = Math.PI / 6;
                this._cards.forEach((card, i) => {
                    const actor = members[i] || null;
                    card.setActor(actor);
                    if (!actor) return;
                    const a = actorAngle(actor);
                    const lin = ((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;   // -180°〜180°
                    card._baseX = this._cx + lin / front * this._step - HUD_W / 2;
                    card._slideAlpha = rsClamp(1 - (Math.abs(lin) - front) / fade, 0, 1);
                });
            }

            update() {
                this.layoutCards();      // 先に位置を決めてから、各カードを更新する
                super.update();
            }

            // 技名の帯を出す位置(カードの立ち絵の頭上。スライドにも追従)
            actorBannerPos(actor) {
                const card = this._cards.find(c => c._actor === actor);
                if (!card) return null;
                return { x: card._baseX + HUD_W / 2, y: card._baseY + Math.max(0, HUD_H - 2 - HUD.portraitH) - 2 };
            }

            // ダメージ表示・戦闘アニメの基準位置(カードの立ち絵の中ほど。スライドにも追従)
            actorAnchor(actor) {
                const card = this._cards.find(c => c._actor === actor);
                return card ? { x: card._baseX + 30, y: card._baseY + HUD_H - 50 } : null;
            }
        }

        if (HUD.enabled) {
            // SVキャラの動き(行動時に前へ出る・退く・のけぞる・入場)を止める
            Sprite_Actor.prototype.updateTargetPosition = function() {};
            Sprite_Actor.prototype.stepForward = function() {};
            Sprite_Actor.prototype.stepBack = function() {};
            Sprite_Actor.prototype.stepFlinch = function() {};
            Sprite_Actor.prototype.retreat = function() {};
            Sprite_Actor.prototype.moveToStartPosition = function() {};
        }

        //-------------------------------------------------------------------------
        // HPリング描画ヘルパー(ゲーム風グラデーション)
        //-------------------------------------------------------------------------
        const hsl = (h, sat, light) => `hsl(${h},${sat}%,${light}%)`;

        // リングの太さ方向(内縁→外縁)の放射グラデーション
        const acrossGradient = (ctx, stops) => {
            const c = RING_HALF;
            const g = ctx.createRadialGradient(c, c, RING_R - RING_W / 2, c, c, RING_R + RING_W / 2);
            stops.forEach(([pos, col]) => g.addColorStop(pos, col));
            return g;
        };

        const strokeArc = (ctx, start, end, style, width) => {
            ctx.lineWidth = width;
            ctx.strokeStyle = style;
            ctx.beginPath();
            ctx.arc(RING_HALF, RING_HALF, RING_R, start, end);
            ctx.stroke();
        };

        // 1キャラぶんの区間を描く: 縁取り → 空の溝 → 本体(色は残量で連続変化) → 光沢
        const drawHpSegment = (ctx, start, end, rate) => {
            // 縁取り
            strokeArc(ctx, start, end, "rgba(255,255,255,0.35)", RING_W + 2);
            // 空の溝(内側と外側が濃い、くぼんだ見た目)
            strokeArc(ctx, start, end, acrossGradient(ctx, [
                [0.00, "rgba(0,0,0,0.92)"],
                [0.50, "rgba(48,48,62,0.88)"],
                [1.00, "rgba(0,0,0,0.92)"]
            ]), RING_W);
            if (rate <= 0) return;

            const tip = start + (end - start) * rate;
            if (!HP_GRADIENT) {
                const flat = rate > 0.5 ? "#66ee66" : rate > 0.25 ? "#eedd44" : "#ee4444";
                strokeArc(ctx, start, tip, flat, RING_W);
                return;
            }

            // 本体: 色相は残量に連動(100%=緑 → 50%=黄 → 0%=赤)。円弧に沿って暗→明
            const hue = Math.round(120 * rate);
            const c = RING_HALF;
            const x1 = c + RING_R * Math.cos(start), y1 = c + RING_R * Math.sin(start);
            const x2 = c + RING_R * Math.cos(tip),   y2 = c + RING_R * Math.sin(tip);
            let body;
            if (Math.hypot(x2 - x1, y2 - y1) < 1) {
                body = hsl(hue, 90, 46);
            } else {
                body = ctx.createLinearGradient(x1, y1, x2, y2);
                body.addColorStop(0.0, hsl(hue, 85, 32));
                body.addColorStop(0.6, hsl(hue, 90, 46));
                body.addColorStop(1.0, hsl(hue, 95, 60));
            }
            strokeArc(ctx, start, tip, body, RING_W);

            // 光沢: 外縁寄りに白いハイライト帯、両縁は暗く落として立体感を出す
            strokeArc(ctx, start, tip, acrossGradient(ctx, [
                [0.00, "rgba(0,0,0,0.40)"],
                [0.30, "rgba(255,255,255,0.00)"],
                [0.55, "rgba(255,255,255,0.50)"],
                [0.62, "rgba(255,255,255,0.12)"],
                [1.00, "rgba(0,0,0,0.45)"]
            ]), RING_W);
        };

        //-------------------------------------------------------------------------
        // ホイール背景描画ヘルパー(6等分の扇形+グラデーション)
        //-------------------------------------------------------------------------
        const parseHex = hex => {
            const m = /^#?([0-9a-f]{6})$/i.exec(safeTrim(hex));
            const v = m ? parseInt(m[1], 16) : 0x888888;
            return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
        };

        // f<0で黒方向、f>0で白方向に寄せる
        const shade = (hex, f) => {
            const [r, g, b] = parseHex(hex);
            const t = f < 0 ? 0 : 255;
            const p = Math.abs(f);
            const mix = v => Math.round(v + (t - v) * p);
            return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
        };

        // 回転する盤面: 6つの扇形(席iの中心角 = (i-1)*STEP、真上が0)
        const drawSectorDisc = (ctx, R) => {
            const c = R;
            if (UI.solid) {
                // ソリッド: 暗い面(色はごくうっすら) + 細い仕切り + アクセントの外周
                for (let i = 0; i < N; i++) {
                    const col = SECTOR_COLORS[i % SECTOR_COLORS.length];
                    const mid = (i - 1) * STEP - Math.PI / 2;
                    const g = ctx.createRadialGradient(c, c, HUB_R, c, c, R);
                    g.addColorStop(0.0, shade(col, -0.86));
                    g.addColorStop(0.6, shade(col, -0.68));
                    g.addColorStop(1.0, shade(col, -0.82));
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.moveTo(c, c);
                    ctx.arc(c, c, R, mid - STEP / 2, mid + STEP / 2);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.lineCap = "butt";
                for (let i = 0; i < N; i++) {
                    const b = (i - 1) * STEP - Math.PI / 2 - STEP / 2;
                    const x1 = c + Math.cos(b) * HUB_R, y1 = c + Math.sin(b) * HUB_R;
                    const x2 = c + Math.cos(b) * R, y2 = c + Math.sin(b) * R;
                    ctx.strokeStyle = "rgba(0,0,0,0.9)";
                    ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                    ctx.strokeStyle = "rgba(240,138,36,0.55)";
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                }
                ctx.strokeStyle = UI.accent;                  // 外周リム
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(c, c, R - 1.5, 0, Math.PI * 2); ctx.stroke();
                ctx.strokeStyle = "rgba(255,255,255,0.14)";   // 内側の細線
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(c, c, R - 5, 0, Math.PI * 2); ctx.stroke();
                return;
            }
            for (let i = 0; i < N; i++) {
                const col = SECTOR_COLORS[i % SECTOR_COLORS.length];
                const mid = (i - 1) * STEP - Math.PI / 2;
                const g = ctx.createRadialGradient(c, c, HUB_R, c, c, R);
                g.addColorStop(0.00, shade(col, -0.45)); // 中心側は深く
                g.addColorStop(0.55, shade(col, 0.15));  // キャラの背後が最も明るい
                g.addColorStop(1.00, shade(col, -0.25)); // 外周はHPリングへ馴染ませる
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.moveTo(c, c);
                ctx.arc(c, c, R, mid - STEP / 2, mid + STEP / 2);
                ctx.closePath();
                ctx.fill();
            }
            // 区画の仕切り(暗い溝+細いハイライト)
            ctx.lineCap = "butt";
            for (let i = 0; i < N; i++) {
                const b = (i - 1) * STEP - Math.PI / 2 - STEP / 2;
                const x1 = c + Math.cos(b) * HUB_R, y1 = c + Math.sin(b) * HUB_R;
                const x2 = c + Math.cos(b) * R,     y2 = c + Math.sin(b) * R;
                ctx.strokeStyle = "rgba(15,15,35,0.85)";
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.strokeStyle = "rgba(255,255,255,0.28)";
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            }
        };

        // 回転しない前面: 後列の減光 → 光沢 → 中央ハブ
        const drawDiscOverlay = (ctx, R) => {
            const c = R;
            if (FRONT_ZONE) {
                ctx.fillStyle = "rgba(0,0,0,0.38)";
                ctx.beginPath();
                ctx.moveTo(c, c);
                ctx.arc(c, c, R, 0, Math.PI); // 下半分 = 後列
                ctx.closePath();
                ctx.fill();
            }
            if (UI.solid) {
                // ソリッド: 暗い台座 + アクセントのリング + 橙のレンズ(光沢なし)
                const h = HUB_R;
                ctx.fillStyle = "#0a0b0e";
                ctx.beginPath(); ctx.arc(c, c, h, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = UI.accent;
                ctx.lineWidth = 2;
                ctx.stroke();
                const lr = h * 0.66;
                const lens = ctx.createLinearGradient(0, c - lr, 0, c + lr);
                lens.addColorStop(0, uiShade(UI.accent, 0.1));
                lens.addColorStop(1, uiShade(UI.accent, -0.55));
                ctx.fillStyle = lens;
                ctx.beginPath(); ctx.arc(c, c, lr, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.6)";
                ctx.lineWidth = 1;
                ctx.stroke();
                return;
            }
            // ガラス風の光沢(左上から)
            ctx.save();
            ctx.beginPath();
            ctx.arc(c, c, R, 0, Math.PI * 2);
            ctx.clip();
            const gx = c - R * 0.30, gy = c - R * 0.45;
            const gl = ctx.createRadialGradient(gx, gy, 0, gx, gy, R * 1.1);
            gl.addColorStop(0.0, "rgba(255,255,255,0.28)");
            gl.addColorStop(0.5, "rgba(255,255,255,0.06)");
            gl.addColorStop(1.0, "rgba(255,255,255,0.00)");
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, R * 2, R * 2);
            ctx.restore();

            // 中央ハブ: 金属の縁 + 深い緑のレンズ + ハイライト
            const h = HUB_R;
            const metal = ctx.createLinearGradient(c - h, c - h, c + h, c + h);
            metal.addColorStop(0.0, "#f4f6fb");
            metal.addColorStop(0.5, "#9aa0b4");
            metal.addColorStop(1.0, "#3c4052");
            ctx.fillStyle = metal;
            ctx.beginPath(); ctx.arc(c, c, h, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.6)";
            ctx.lineWidth = 1;
            ctx.stroke();

            const lr = h * 0.72;
            const lens = ctx.createRadialGradient(c - lr * 0.2, c - lr * 0.25, 0, c, c, lr);
            lens.addColorStop(0.0, "#5fe6b8");
            lens.addColorStop(0.55, "#12806a");
            lens.addColorStop(1.0, "#062a30");
            ctx.fillStyle = lens;
            ctx.beginPath(); ctx.arc(c, c, lr, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "rgba(255,255,255,0.45)";
            ctx.beginPath(); ctx.arc(c - lr * 0.35, c - lr * 0.4, lr * 0.22, 0, Math.PI * 2); ctx.fill();
        };

        class Sprite_WheelFace extends Sprite {
            initialize(actor) {
                super.initialize();
                this._actor = actor;
                if (FACE_STYLE === "portrait") {
                    this.createPortrait(actor);
                } else {
                    this.addCircleFace(actor, FR);
                }
            }

            // 従来方式: 白枠つきの円形顔グラ
            addCircleFace(actor, radius) {
                const d = radius * 2;
                const frame = new Sprite(new Bitmap(d + 6, d + 6));
                frame.bitmap.drawCircle(radius + 3, radius + 3, radius + 3, "#ffffff");
                frame.anchor.set(0.5);
                this.addChild(frame);

                const faceBmp = new Bitmap(d, d);
                const src = ImageManager.loadFace(actor.faceName());
                src.addLoadListener(() => {
                    const idx = actor.faceIndex();
                    const c = faceBmp.context;
                    c.save();
                    c.beginPath();
                    c.arc(radius, radius, radius, 0, Math.PI * 2);
                    c.clip();
                    c.drawImage(src._canvas || src._image,
                        (idx % 4) * 144, Math.floor(idx / 4) * 144,
                        144, 144, 0, 0, d, d);
                    c.restore();
                    faceBmp._baseTexture.update();
                });
                this._face = new Sprite(faceBmp);
                this._face.anchor.set(0.5);
                this.addChild(this._face);
            }

            // ポートレート方式: SVキャラの待機ポーズを大きく描く(枠なし・足元に影)
            createPortrait(actor) {
                const S = PORTRAIT_SIZE;
                if (!actor.battlerName()) {
                    this.addCircleFace(actor, Math.round(S * 0.4)); // SV画像が無ければ顔グラで代用
                    return;
                }
                const bmp = new Bitmap(S, S);
                const c0 = bmp.context;
                c0.fillStyle = "rgba(0,0,0,0.38)";
                c0.beginPath();
                c0.ellipse(S / 2, S - 5, S * 0.32, S * 0.07, 0, 0, Math.PI * 2);
                c0.fill();
                bmp._baseTexture.update();

                const src = ImageManager.loadSvActor(actor.battlerName());
                src.addLoadListener(() => {
                    // SV画像は9列×6行。待機モーション(2行目)の中央パターンを使う
                    const cw = src.width / 9;
                    const ch = src.height / 6;
                    const k = Math.min((S * 0.95) / cw, (S * 0.95) / ch);
                    const dw = cw * k;
                    const dh = ch * k;
                    bmp.context.drawImage(src._canvas || src._image,
                        cw * 1, ch * 1, cw, ch, (S - dw) / 2, S - dh - 4, dw, dh);
                    bmp._baseTexture.update();
                });
                this._face = new Sprite(bmp);
                this._face.anchor.set(0.5);
                this.addChild(this._face);
            }

            updateState() {
                this.alpha = this._actor.isDead() ? 0.4 : 1;
            }
        }

        class Sprite_BattleWheel extends Sprite {
            initialize() {
                super.initialize();
                this.sortableChildren = true; // 手前(前列)のキャラを上に重ねる
                this._drag = false;
                this._lastAngle = 0;
                this._vel = 0;
                this._target = 0;
                this.createDisc();
                this.createHpRing();
                this._faces = FACE_STYLE === "sector" ? [] : $gameParty.wheelMembers().map(a => {
                    const f = new Sprite_WheelFace(a);
                    this.addChild(f);
                    return f;
                });
                this.layoutFaces();
                this.updateHpRing();
            }

            createDisc() {
                const R = DISC_R;
                if (WHEEL_IMAGE) {
                    const bmp = ImageManager.loadSystem(WHEEL_IMAGE);
                    this._discSprite = new Sprite(bmp);
                    this._discSprite.anchor.set(0.5);
                    this._discSprite.x = WX;
                    this._discSprite.y = WY;
                    if (FIT_IMAGE) {
                        bmp.addLoadListener(() => {
                            const s = (R * 2) / Math.max(bmp.width, bmp.height);
                            this._discSprite.scale.set(s);
                        });
                    }
                    this.addChild(this._discSprite);
                    this.createSectorFaces();
                    return;
                }
                const disc = new Sprite(new Bitmap(R * 2, R * 2));
                disc.anchor.set(0.5);
                disc.x = WX;
                disc.y = WY;
                drawSectorDisc(disc.bitmap.context, R);
                disc.bitmap._baseTexture.update();
                this._discSprite = disc;   // 回転するのはこの盤面だけ
                this.addChild(disc);
                this.createSectorFaces();  // 顔グラ扇形(sector方式のときのみ)

                // 回転しない前面(後列の減光・光沢・中央ハブ)
                const overlay = new Sprite(new Bitmap(R * 2, R * 2));
                overlay.anchor.set(0.5);
                overlay.x = WX;
                overlay.y = WY;
                drawDiscOverlay(overlay.bitmap.context, R);
                overlay.bitmap._baseTexture.update();
                this.addChild(overlay);
            }

            // 顔グラ扇形: 顔グラを各区画の形(HPリング内側〜ハブ外側)にクリップして敷き詰める
            createSectorFaces() {
                if (FACE_STYLE !== "sector") return;
                const R = DISC_R;
                const sprite = new Sprite(new Bitmap(R * 2, R * 2));
                sprite.anchor.set(0.5);
                sprite.x = WX;
                sprite.y = WY;
                this._sectorFaces = sprite;
                this._sectorKey = "";
                this.addChild(sprite);
            }

            updateSectorFaces() {
                if (!this._sectorFaces) return;
                const members = $gameParty.wheelMembers();
                const sources = members.map(a => ImageManager.loadFace(a.faceName()));
                const key = [wheelRot.toFixed(3)].concat(members.map((a, i) =>
                    [a.isDead() ? 1 : 0, a.faceName(), a.faceIndex(), sources[i].isReady() ? 1 : 0].join(":")
                )).join("|");
                if (key === this._sectorKey) return;   // 変化があるときだけ描き直す
                this._sectorKey = key;

                const bmp = this._sectorFaces.bitmap;
                const ctx = bmp.context;
                const c = DISC_R;
                const ri = HUB_R + 1;                       // ハブの外側
                const ro = RING_R - RING_W / 2 - 1;         // HPリングの内側
                const gap = 1.5 * Math.PI / 180;
                const half = STEP / 2;

                // 顔グラを正立で置く正方形が扇形を覆うサイズ(重心から最遠角まで)
                const rc = (ri + ro) / 2;
                const corners = [[ro, half], [ro, -half], [ri, half], [ri, -half]];
                const dmax = Math.max(...corners.map(([r, t]) =>
                    Math.hypot(r * Math.cos(t) - rc, r * Math.sin(t))));
                const size = Math.ceil(dmax * 2) + 2;

                bmp.clear();
                members.forEach((actor, i) => {
                    const mid = (i - 1 + wheelRot) * STEP - Math.PI / 2;
                    const a0 = mid - half + gap;
                    const a1 = mid + half - gap;
                    const wedge = () => {
                        ctx.beginPath();
                        ctx.arc(c, c, ro, a0, a1, false);
                        ctx.arc(c, c, ri, a1, a0, true);
                        ctx.closePath();
                    };
                    const src = sources[i];
                    ctx.save();
                    wedge();
                    ctx.clip();
                    if (src.isReady() && src.width > 0) {   // 顔グラ未設定(空Bitmap)は描かない
                        const idx = actor.faceIndex();
                        const cx = c + Math.cos(mid) * rc;
                        const cy = c + Math.sin(mid) * rc;
                        ctx.globalAlpha = actor.isDead() ? 0.4 : 1;
                        ctx.drawImage(src._canvas || src._image,
                            (idx % 4) * 144, Math.floor(idx / 4) * 144, 144, 144,
                            cx - size / 2, cy - size / 2, size, size);
                    }
                    ctx.restore();
                    // 縁取り(暗い外側線 + 細いハイライト)
                    ctx.save();
                    wedge();
                    ctx.lineJoin = "round";
                    ctx.strokeStyle = "rgba(15,15,35,0.85)";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.strokeStyle = "rgba(255,255,255,0.35)";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.restore();
                });
                bmp._baseTexture.update();
            }

            createHpRing() {
                const size = RING_HALF * 2;
                this._hpRing = new Sprite(new Bitmap(size, size));
                this._hpRing.anchor.set(0.5);
                this._hpRing.x = WX;
                this._hpRing.y = WY;
                this.addChild(this._hpRing);
            }

            updateHpRing() {
                const bmp = this._hpRing.bitmap;
                const ctx = bmp.context;
                const members = $gameParty.wheelMembers();
                bmp.clear();
                ctx.lineCap = "butt";

                for (let i = 0; i < N; i++) {
                    const actor = members[i];
                    if (!actor) continue;
                    const rate = actor.mhp > 0 ? Math.max(0, Math.min(1, actor.hp / actor.mhp)) : 0;
                    const center = (i - 1 + wheelRot) * STEP - Math.PI / 2;
                    const start = center - STEP / 2 + RING_GAP / 2;
                    const end = center + STEP / 2 - RING_GAP / 2;
                    drawHpSegment(ctx, start, end, rate);
                }
                bmp._baseTexture.update();
            }

            update() {
                super.update();
                this.updateInput();
                this.layoutFaces();
                this.updateSectorFaces();
                this.updateHpRing();
                this.updateDiscRotation();
            }

            updateDiscRotation() {
                if (this._discSprite) {
                    this._discSprite.rotation = wheelRot * STEP;
                }
            }

            touchAngle() {
                const p = TouchInput.localPosition("bottom");
                return Math.atan2(p.x - WX, -(p.y - WY));
            }

            updateInput() {
                if (wazaBusy) {
                    // わざ中はホイールを動かさない(慣性だけ収束させる)
                    const diff0 = this._target - wheelRot;
                    wheelRot = Math.abs(diff0) < 0.002 ? this._target : wheelRot + diff0 * 0.2;
                    return;
                }
                if (TouchInput.isTriggered()) {
                    const p = TouchInput.localPosition("bottom");
                    const d = Math.hypot(p.x - WX, p.y - WY);
                    if (d <= DISC_R) {
                        this._drag = true;
                        wheelDragging = true;
                        this._lastAngle = this.touchAngle();
                        this._vel = 0;
                    }
                }

                if (this._drag) {
                    if (TouchInput.isPressed()) {
                        const ang = this.touchAngle();
                        let delta = ang - this._lastAngle;
                        while (delta > Math.PI) delta -= Math.PI * 2;
                        while (delta < -Math.PI) delta += Math.PI * 2;
                        this._lastAngle = ang;
                        const steps = delta / STEP;
                        wheelRot += steps;
                        this._vel = this._vel * 0.5 + steps * 0.5;
                    } else {
                        this._drag = false;
                        const inertia = Math.max(-1.5, Math.min(1.5, this._vel * 5));
                        this.commit(Math.round(wheelRot + inertia));
                        wheelDragging = false;
                    }
                    return;
                }

                if (Input.isTriggered("pageup")) this.commit(Math.round(this._target) - 1);
                if (Input.isTriggered("pagedown")) this.commit(Math.round(this._target) + 1);

                const diff = this._target - wheelRot;
                wheelRot = Math.abs(diff) < 0.002 ? this._target : wheelRot + diff * 0.2;
            }

            commit(target) {
                this._target = target;
                $gameParty.setWheelOffset(target);
                clearBackRowActions();
            }

            layoutFaces() {
                this._faces.forEach((f, i) => {
                    const a = (i - 1 + wheelRot) * STEP;
                    const c = Math.cos(a);
                    f.x = WX + Math.sin(a) * WR;
                    f.y = WY - c * WR;
                    f.scale.set(0.75 + 0.25 * Math.max(0, c));
                    f.zIndex = 200 + Math.round(c * 100);
                    f.updateState();
                });
            }
        }

    //-------------------------------------------------------------------------
    // スタミナシステム
    //   ・アクターごとに最大値を保持
    //   ・行動開始時にスキル別消費(未指定は消費ベース値)
    //   ・前衛/後衛で毎秒回復量を変更。後衛は前衛より速く回復
    //   ・残量に応じてAGI(攻撃速度)とDEF(防御力)を連続的に低下
    //   ・0でも行動不能にはしない
    //-------------------------------------------------------------------------
    const STAMINA_MAX = Math.max(1, Number(prm.staminaMax ?? 100));
    const STAMINA_BASE_COST = Math.max(0, Number(prm.staminaBaseCost ?? 10));
    const STAMINA_FRONT_RECOVERY = Math.max(0, Number(prm.staminaFrontRecovery ?? 2));
    const STAMINA_BACK_RECOVERY = Math.max(0, Number(prm.staminaBackRecovery ?? 6));
    const STAMINA_MIN_SPEED_RATE = Math.max(0, Math.min(1, Number(prm.staminaMinSpeedRate ?? 0.5)));
    const STAMINA_MIN_DEF_RATE = Math.max(0, Math.min(1, Number(prm.staminaMinDefRate ?? 0.6)));
    const STAMINA_COSTS = (() => {
        const result = {};
        try {
            const list = JSON.parse(prm.staminaActionCosts || "[]");
            for (const raw of list) {
                const e = parseJson(raw, null);
                if (!e) continue;
                const id = Number(e.skillId);
                const cost = Number(e.cost);
                if (id > 0 && Number.isFinite(cost)) result[id] = Math.max(0, cost);
            }
        } catch (e) {}
        return result;
    })();

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._battleStamina = STAMINA_MAX;
    };

    Game_Actor.prototype.maxBattleStamina = function() {
        return STAMINA_MAX;
    };

    Game_Actor.prototype.battleStamina = function() {
        if (!Number.isFinite(this._battleStamina)) this._battleStamina = STAMINA_MAX;
        return Math.max(0, Math.min(this.maxBattleStamina(), this._battleStamina));
    };

    Game_Actor.prototype.battleStaminaRate = function() {
        const max = this.maxBattleStamina();
        return max > 0 ? this.battleStamina() / max : 0;
    };

    // 戦闘開始時のスタミナ初期値(パラメータ / アクターのメモ欄 <スタミナ初期値:数値>)
    Game_Actor.prototype.battleStaminaInitialValue = function() {
        const data = this.actor();
        const note = (data && data.note) || "";
        const m = note.match(/<(?:スタミナ初期値|StaminaInitial)\s*:\s*(-?\d+)\s*>/i);
        if (m) return Number(m[1]);
        return Number(prm.staminaInitialValue ?? -1);
    };

    Game_Actor.prototype.setBattleStamina = function(value) {
        this._battleStamina = Math.max(0, Math.min(this.maxBattleStamina(), Number(value) || 0));
    };

    Game_Actor.prototype.gainBattleStamina = function(value) {
        this.setBattleStamina(this.battleStamina() + Number(value || 0));
    };

    Game_Actor.prototype.staminaActionCost = function(action) {
        if (!action || !action.item || !action.isSkill || !action.isSkill()) return STAMINA_BASE_COST;
        const item = action.item();
        if (!item) return STAMINA_BASE_COST;
        if (Object.prototype.hasOwnProperty.call(STAMINA_COSTS, item.id)) return STAMINA_COSTS[item.id];
        return STAMINA_BASE_COST;
    };

    Game_Actor.prototype.consumeBattleStamina = function(action) {
        this.gainBattleStamina(-this.staminaActionCost(action));
    };

    Game_Actor.prototype.staminaRecoveryPerSecond = function() {
        return $gameParty && $gameParty.battleMembers && $gameParty.battleMembers().includes(this)
            ? STAMINA_FRONT_RECOVERY : STAMINA_BACK_RECOVERY;
    };

    const _Game_Actor_onBattleStart = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function(advantageous) {
        _Game_Actor_onBattleStart.call(this, advantageous);
        const initial = this.battleStaminaInitialValue();
        this.setBattleStamina(initial < 0 ? this.maxBattleStamina() : initial);
    };

    // スタミナ残量をAGI/DEFに反映。0でも行動自体は可能。
    const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    Game_BattlerBase.prototype.param = function(paramId) {
        const value = _Game_BattlerBase_param.call(this, paramId);
        if (this.isActor && this.isActor() && $gameParty && $gameParty.inBattle && $gameParty.inBattle()) {
            const actor = this;
            const rate = actor.battleStaminaRate ? actor.battleStaminaRate() : 1;
            if (paramId === 6) { // AGI = 攻撃速度
                const mult = STAMINA_MIN_SPEED_RATE + (1 - STAMINA_MIN_SPEED_RATE) * rate;
                return value * mult;
            }
            if (paramId === 3) { // DEF = 防御力
                const mult = STAMINA_MIN_DEF_RATE + (1 - STAMINA_MIN_DEF_RATE) * rate;
                return value * mult;
            }
        }
        return value;
    };

    // 行動開始時に一度だけ消費。コスト0なら無料行動。
    const _BattleManager_startAction_stamina = BattleManager.startAction;
    BattleManager.startAction = function() {
        const subject = this._subject;
        if (subject && subject.isActor && subject.isActor()) {
            const action = subject.currentAction ? subject.currentAction() : null;
            if (action && action.isSkill && action.isSkill()) subject.consumeBattleStamina(action);
        }
        _BattleManager_startAction_stamina.call(this);
    };

    // 前衛/後衛とも自然回復。後衛は前衛より速い。
    const _Scene_Battle_update_stamina = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update_stamina.call(this);
        if (!$gameParty || !$gameParty.inBattle()) return;
        const delta = wazaBusy ? 0 : 1 / 60;
        for (const actor of $gameParty.wheelMembers ? $gameParty.wheelMembers() : $gameParty.allMembers()) {
            if (!actor || actor.isDead() || !actor.gainBattleStamina) continue;
            actor.gainBattleStamina(actor.staminaRecoveryPerSecond() * delta);
        }
    };

    //-------------------------------------------------------------------------
    // スタミナリング描画: HPリングの外側に細い水色ゲージを重ねる
    //-------------------------------------------------------------------------
    const STAMINA_W = 5;
    const STAMINA_R = RING_R + 7;
    const STAMINA_HALF = Math.ceil(STAMINA_R + STAMINA_W / 2 + 3);
    const staminaAcrossGradient = (ctx, stops) => {
        const c = STAMINA_HALF;
        const g = ctx.createRadialGradient(c, c, STAMINA_R - STAMINA_W / 2, c, c, STAMINA_R + STAMINA_W / 2);
        stops.forEach(([pos, col]) => g.addColorStop(pos, col));
        return g;
    };
    const strokeStaminaArc = (ctx, start, end, style, width) => {
        ctx.lineWidth = width;
        ctx.strokeStyle = style;
        ctx.beginPath();
        ctx.arc(STAMINA_HALF, STAMINA_HALF, STAMINA_R, start, end);
        ctx.stroke();
    };
    const drawStaminaSegment = (ctx, start, end, rate) => {
        strokeStaminaArc(ctx, start, end, "rgba(255,255,255,0.32)", STAMINA_W + 2);
        strokeStaminaArc(ctx, start, end, staminaAcrossGradient(ctx, [
            [0, "rgba(0,15,25,0.95)"],
            [0.5, "rgba(28,62,75,0.92)"],
            [1, "rgba(0,12,20,0.95)"]
        ]), STAMINA_W);
        if (rate <= 0) return;
        const tip = start + (end - start) * rate;
        const c = STAMINA_HALF;
        const x1 = c + STAMINA_R * Math.cos(start), y1 = c + STAMINA_R * Math.sin(start);
        const x2 = c + STAMINA_R * Math.cos(tip), y2 = c + STAMINA_R * Math.sin(tip);
        const body = ctx.createLinearGradient(x1, y1, x2, y2);
        body.addColorStop(0, "#167f9b");
        body.addColorStop(0.55, "#62e8ff");
        body.addColorStop(1, "#c8f8ff");
        strokeStaminaArc(ctx, start, tip, body, STAMINA_W);
        strokeStaminaArc(ctx, start, tip, staminaAcrossGradient(ctx, [
            [0, "rgba(0,40,55,0.45)"],
            [0.42, "rgba(255,255,255,0.05)"],
            [0.62, "rgba(255,255,255,0.65)"],
            [1, "rgba(0,20,30,0.35)"]
        ]), STAMINA_W);
    };

    const _Sprite_BattleWheel_createHpRing = Sprite_BattleWheel.prototype.createHpRing;
    Sprite_BattleWheel.prototype.createHpRing = function() {
        _Sprite_BattleWheel_createHpRing.call(this);
        const size = STAMINA_HALF * 2;
        this._staminaRing = new Sprite(new Bitmap(size, size));
        this._staminaRing.anchor.set(0.5);
        this._staminaRing.x = WX;
        this._staminaRing.y = WY;
        this.addChild(this._staminaRing);
    };

    const _Sprite_BattleWheel_updateHpRing = Sprite_BattleWheel.prototype.updateHpRing;
    Sprite_BattleWheel.prototype.updateHpRing = function() {
        _Sprite_BattleWheel_updateHpRing.call(this);
        if (!this._staminaRing) return;
        const bmp = this._staminaRing.bitmap;
        const ctx = bmp.context;
        const members = $gameParty.wheelMembers();
        bmp.clear();
        ctx.lineCap = "butt";
        for (let i = 0; i < N; i++) {
            const actor = members[i];
            if (!actor) continue;
            const rate = actor.battleStaminaRate ? actor.battleStaminaRate() : 1;
            const center = (i - 1 + wheelRot) * STEP - Math.PI / 2;
            const start = center - STEP / 2 + RING_GAP / 2;
            const end = center + STEP / 2 - RING_GAP / 2;
            drawStaminaSegment(ctx, start, end, rate);
        }
        bmp._baseTexture.update();
    };



        //-------------------------------------------------------------------------
        // 戦闘の4ボタン(下画面のホイール以外の部分を四分割)
        //   0:左上 1:右上 2:左下 3:右下
        //-------------------------------------------------------------------------
        const BTN_ENABLED = P.buttonsEnabled !== "false";
        const BTN_FONT = Number(P.buttonFontSize ?? 22);
        const BTN_GAP = Number(P.buttonGap ?? 3);
        const BTN_EDGE = Number(P.buttonEdge ?? 2);
        const BTN_SE = P.buttonSe !== "false";
        const BTN_IMG_CLIP = P.buttonImageClip !== "false";
        const BTN_IMG_FIT = P.buttonImageFit || "stretch";
        // ホイール(HPリング・スタミナリング含む)の外側から少し離した円
        const BTN_CLEAR_R = Math.max(DISC_R, RING_R + 12) + Number(P.buttonInnerGap ?? 4);

        const BTN_DEFAULTS = [
            { label: "わざ",     color1: "#58b4ff", color2: "#1c4fb4" },
            { label: "ねらう",   color1: "#4fd0f0", color2: "#1a78c8" },
            { label: "おはらい", color1: "#ffb347", color2: "#d4621a" },
            { label: "アイテム", color1: "#7ed957", color2: "#2e8e32" }
        ];
        const BTN_DEFS = (() => {
            const list = parseJson(P.wheelButtons, []).map(x => parseJson(x, {}) || {});
            return BTN_DEFAULTS.map((d, i) => {
                const u = list[i] || {};
                return {
                    label: u.label ?? d.label,
                    color1: u.color1 || d.color1,
                    color2: u.color2 || d.color2,
                    image: u.image || "",
                    imageFocus: u.imageFocus || "",
                    imagePress: u.imagePress || ""
                };
            });
        })();

        // 各ボタンの矩形(下画面ローカル座標)。ホイール中心の十字線で四分割
        const BTN_RECTS = (() => {
            const E = BTN_EDGE, G = BTN_GAP, W = CFG.botW, H = CFG.botH;
            return [
                { x0: E,      y0: E,      x1: WX - G, y1: WY - G, fx: -1, fy: -1 },
                { x0: WX + G, y0: E,      x1: W - E,  y1: WY - G, fx:  1, fy: -1 },
                { x0: E,      y0: WY + G, x1: WX - G, y1: H - E,  fx: -1, fy:  1 },
                { x0: WX + G, y0: WY + G, x1: W - E,  y1: H - E,  fx:  1, fy:  1 }
            ];
        })();

        class Sprite_WheelButton extends Sprite {
            initialize(index) {
                super.initialize();
                const r = BTN_RECTS[index];
                this._index = index;
                this._def = BTN_DEFS[index];
                this._rect = r;
                this._w = Math.max(8, Math.round(r.x1 - r.x0));
                this._h = Math.max(8, Math.round(r.y1 - r.y0));
                this._cx = WX - r.x0;      // 円の中心(ボタン内ローカル)
                this._cy = WY - r.y0;
                // 角丸: 画面の角側は大きく、他は小さく
                const RO = 16, RI = 7;
                this._radii = [RI, RI, RI, RI];
                const corner = r.fy < 0 ? (r.fx < 0 ? 0 : 1) : (r.fx < 0 ? 3 : 2);
                this._radii[corner] = RO;
                this._enabled = true;
                this._focus = 0; this._focusTarget = false;
                this._press = 0; this._pressTarget = false;
                this._punch = 0; this._flash = 0;
                this._shineT = -1; this._ripple = -1;
                this._rx = 0; this._ry = 0;
                this._age = 0;
                this._shownBitmap = null;
                this.findLabelSpot();

                this.pivot.set(this._lx, this._ly);
                this._baseX = r.x0 + this._lx;
                this._baseY = r.y0 + this._ly;
                this.x = this._baseX;
                this.y = this._baseY;

                this._normalBmp = this._def.image ? this.makeImageBitmap(this._def.image) : this.makeNormalBitmap();
                this._focusBmp = this._def.imageFocus ? this.makeImageBitmap(this._def.imageFocus) : null;
                this._pressBmp = this._def.imagePress ? this.makeImageBitmap(this._def.imagePress) : null;

                this._base = new Sprite(this._normalBmp);
                this._base.x = 0; this._base.y = 0;
                this._base.setBlendColor([0, 0, 0, 0]);
                this.addChild(this._base);

                if (!this._focusBmp) {
                    this._glow = new Sprite(this.makeGlowBitmap());
                    this._glow.blendMode = 1;   // 加算合成
                    this._glow.opacity = 0;
                    this.addChild(this._glow);
                }
                this._fx = new Sprite(new Bitmap(this._w, this._h));
                this.addChild(this._fx);
                this._fxDirty = false;
                this.updateAppear();
            }

            // 円・縁から最も離れた場所(=ラベルを置く場所)を探す
            findLabelSpot() {
                const w = this._w, h = this._h;
                let best = -1, bx = w / 2, by = h / 2;
                for (let y = 4; y < h; y += 2) {
                    for (let x = 4; x < w; x += 2) {
                        const d = Math.min(x, w - x, y, h - y,
                            Math.hypot(x - this._cx, y - this._cy) - BTN_CLEAR_R);
                        if (d > best) { best = d; bx = x; by = y; }
                    }
                }
                this._lx = bx;
                this._ly = by;
                this._clearance = Math.max(0, best);
            }

            // ----- 形(角丸四角 - 円)の描画補助 -----
            roundRectPath(ctx, x, y, w, h, r, begin = true) {
                if (UI.solid) {              // 面取り(角を斜めに切る)
                    const k = r.map(v => v * 0.6);
                    if (begin) ctx.beginPath();
                    ctx.moveTo(x + k[0], y);
                    ctx.lineTo(x + w - k[1], y);
                    ctx.lineTo(x + w, y + k[1]);
                    ctx.lineTo(x + w, y + h - k[2]);
                    ctx.lineTo(x + w - k[2], y + h);
                    ctx.lineTo(x + k[3], y + h);
                    ctx.lineTo(x, y + h - k[3]);
                    ctx.lineTo(x, y + k[0]);
                    ctx.closePath();
                    return;
                }
                if (begin) ctx.beginPath();
                ctx.moveTo(x + r[0], y);
                ctx.lineTo(x + w - r[1], y);
                ctx.arcTo(x + w, y, x + w, y + r[1], r[1]);
                ctx.lineTo(x + w, y + h - r[2]);
                ctx.arcTo(x + w, y + h, x + w - r[2], y + h, r[2]);
                ctx.lineTo(x + r[3], y + h);
                ctx.arcTo(x, y + h, x, y + h - r[3], r[3]);
                ctx.lineTo(x, y + r[0]);
                ctx.arcTo(x, y, x + r[0], y, r[0]);
                ctx.closePath();
            }

            // k だけ内側に縮めた「ボタンの形」にクリップして fn を実行
            withShape(ctx, k, fn) {
                ctx.save();
                this.roundRectPath(ctx, k, k, this._w - k * 2, this._h - k * 2,
                    this._radii.map(r => Math.max(0, r - k)));
                ctx.clip();
                ctx.beginPath();
                ctx.rect(-50, -50, this._w + 100, this._h + 100);
                ctx.moveTo(this._cx + BTN_CLEAR_R + k, this._cy);
                ctx.arc(this._cx, this._cy, BTN_CLEAR_R + k, 0, Math.PI * 2);
                ctx.clip("evenodd");
                fn();
                ctx.restore();
            }

            hitTest(x, y) {   // ボタン内ローカル座標
                return x >= 0 && y >= 0 && x < this._w && y < this._h &&
                    Math.hypot(x - this._cx, y - this._cy) > BTN_CLEAR_R;
            }

            // ----- 画像 -----
            // 画像をボタンの形(角丸四角 - ホイールの円)で切り抜いて描く(はみ出し防止)
            makeImageBitmap(name) {
                const bmp = new Bitmap(this._w, this._h);
                const src = ImageManager.loadSystem(name);
                src.addLoadListener(() => {
                    const el = ttElement(src);
                    if (!el || src.width <= 0) return;
                    const ctx = bmp.context;
                    const sw = src.width, sh = src.height;
                    let dx = 0, dy = 0, dw = this._w, dh = this._h;
                    if (BTN_IMG_FIT !== "stretch") {
                        const k = BTN_IMG_FIT === "cover"
                            ? Math.max(this._w / sw, this._h / sh)
                            : Math.min(this._w / sw, this._h / sh);
                        dw = sw * k;
                        dh = sh * k;
                        dx = (this._w - dw) / 2;
                        dy = (this._h - dh) / 2;
                    }
                    const draw = () => ctx.drawImage(el, 0, 0, sw, sh, dx, dy, dw, dh);
                    if (BTN_IMG_CLIP) this.withShape(ctx, 0, draw);
                    else draw();
                    bmp._baseTexture.update();
                });
                return bmp;
            }

            // ----- 通常時の見た目(光沢のあるカプセル風) -----
            // ソリッド: アクセントの外枠 + 暗い面 + 同心円の細線 + 画面の角の三角
            makeNormalSolid() {
                const bmp = new Bitmap(this._w, this._h);
                const ctx = bmp.context;
                const w = this._w, h = this._h, r = this._rect;
                this.withShape(ctx, 0, () => { ctx.fillStyle = UI.accent; ctx.fillRect(0, 0, w, h); });
                this.withShape(ctx, 2, () => {
                    const g = ctx.createLinearGradient(0, 0, 0, h);
                    g.addColorStop(0, UI.base2);
                    g.addColorStop(1, UI.base);
                    ctx.fillStyle = g;
                    ctx.fillRect(0, 0, w, h);
                    ctx.strokeStyle = "rgba(240,138,36,0.14)";
                    ctx.lineWidth = 1;
                    for (let rad = BTN_CLEAR_R + 12; rad < 300; rad += 14) {
                        ctx.beginPath();
                        ctx.arc(this._cx, this._cy, rad, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    const ox = r.fx < 0 ? 0 : w, oy = r.fy < 0 ? 0 : h;     // 画面の角の三角
                    ctx.fillStyle = UI.accent;
                    ctx.beginPath();
                    ctx.moveTo(ox, oy);
                    ctx.lineTo(ox - r.fx * 18, oy);
                    ctx.lineTo(ox, oy - r.fy * 18);
                    ctx.closePath();
                    ctx.fill();
                });
                bmp._baseTexture.update();
                this.drawLabel(bmp, this._def.label);
                return bmp;
            }

            makeNormalBitmap() {
                if (UI.solid) return this.makeNormalSolid();
                const bmp = new Bitmap(this._w, this._h);
                const ctx = bmp.context;
                const w = this._w, h = this._h, r = this._rect;
                const def = this._def;
                // 外枠(濃紺)→ 白い縁
                this.withShape(ctx, 0, () => { ctx.fillStyle = "#0d1a36"; ctx.fillRect(0, 0, w, h); });
                this.withShape(ctx, 2, () => { ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.fillRect(0, 0, w, h); });
                // 本体
                this.withShape(ctx, 3.5, () => {
                    const ox = r.fx < 0 ? 0 : w;
                    const oy = r.fy < 0 ? 0 : h;
                    const g = ctx.createLinearGradient(ox, oy, this._cx, this._cy);
                    g.addColorStop(0, def.color1);
                    g.addColorStop(1, def.color2);
                    ctx.fillStyle = g;
                    ctx.fillRect(0, 0, w, h);
                    // ホイールを囲む同心円の模様
                    ctx.strokeStyle = "rgba(255,255,255,0.11)";
                    ctx.lineWidth = 3;
                    for (let rad = BTN_CLEAR_R + 14; rad < 300; rad += 17) {
                        ctx.beginPath();
                        ctx.arc(this._cx, this._cy, rad, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    // 円に沿った内側の影
                    const sh = ctx.createRadialGradient(this._cx, this._cy, BTN_CLEAR_R, this._cx, this._cy, BTN_CLEAR_R + 16);
                    sh.addColorStop(0, "rgba(0,0,30,0.45)");
                    sh.addColorStop(1, "rgba(0,0,30,0)");
                    ctx.fillStyle = sh;
                    ctx.fillRect(0, 0, w, h);
                    // 上側の光沢
                    const gl = ctx.createLinearGradient(0, 0, 0, h * 0.55);
                    gl.addColorStop(0, "rgba(255,255,255,0.45)");
                    gl.addColorStop(1, "rgba(255,255,255,0)");
                    ctx.fillStyle = gl;
                    ctx.fillRect(0, 0, w, h * 0.55);
                });
                bmp._baseTexture.update();
                this.drawLabel(bmp, def.label);
                return bmp;
            }

            drawLabel(bmp, text) {
                if (!text) return;
                const maxW = Math.max(16, Math.floor(this._clearance * 2 - 6));
                bmp.fontFace = uiFace();
                bmp.fontBold = true;
                bmp.fontItalic = false;
                let size = BTN_FONT;
                bmp.fontSize = size;
                while (size > 10 && bmp.measureTextWidth(text) > maxW) {
                    size--;
                    bmp.fontSize = size;
                }
                bmp.textColor = uiTextColor("#ffffff");
                bmp.outlineColor = UI.solid ? "rgba(0,0,0,0.9)" : "rgba(10,25,70,0.95)";
                bmp.outlineWidth = Math.max(3, Math.round(size * (UI.solid ? 0.2 : 0.28)));
                const lh = size + 8;
                bmp.drawText(text, this._lx - maxW / 2, this._ly - lh / 2, maxW, lh, "center");
            }

            // フォーカス時の縁の光(内側に滲ませる)
            makeGlowBitmap() {
                const bmp = new Bitmap(this._w, this._h);
                const ctx = bmp.context;
                const w = this._w, h = this._h;
                this.withShape(ctx, 1, () => {
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = "#ffffff";
                    ctx.shadowBlur = 12;
                    for (let i = 0; i < 2; i++) {
                        ctx.beginPath();
                        ctx.rect(-60, -60, w + 120, h + 120);
                        this.roundRectPath(ctx, 1, 1, w - 2, h - 2, this._radii, false);
                        ctx.fill("evenodd");
                        ctx.beginPath();
                        ctx.arc(this._cx, this._cy, BTN_CLEAR_R, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                bmp._baseTexture.update();
                return bmp;
            }

            // ----- 状態の操作 -----
            setFocus(v) {
                if (this._focusTarget === v) return;
                this._focusTarget = v;
                if (v && this._enabled) this._shineT = 0;   // 光の帯が走る
            }

            setPress(v, lx, ly) {
                if (this._pressTarget === v) return;
                this._pressTarget = v;
                if (v) this.startRipple(lx, ly);
            }

            startRipple(lx, ly) {
                this._rx = lx ?? this._lx;
                this._ry = ly ?? this._ly;
                this._ripple = 0;
            }

            decide() {
                this._flash = 1;
                this._punch = 1;
                this.startRipple(this._lx, this._ly);
            }

            setEnabled(v) {
                this._enabled = !!v;
            }

            // ----- 毎フレーム -----
            update() {
                super.update();
                this._age++;
                this.updateAppear();
                this.updateRates();
                this.updateFx();
                this.updateLook();
            }

            // 戦闘開始時: 画面の角から滑り込む
            updateAppear() {
                const t = Math.max(0, Math.min(1, (this._age - this._index * 5) / 18));
                const e = 1 - Math.pow(1 - t, 3);
                this._appear = e;
                const out = 28 * (1 - e);
                this.x = this._baseX + this._rect.fx * out;
                this.y = this._baseY + this._rect.fy * out;
            }

            approach(cur, target, speed) {
                return cur + Math.max(-speed, Math.min(speed, target - cur));
            }

            updateRates() {
                const f = this._enabled && this._focusTarget ? 1 : 0;
                const p = this._enabled && this._pressTarget ? 1 : 0;
                this._focus = this.approach(this._focus, f, 0.18);
                this._press = this.approach(this._press, p, 0.3);
                this._punch = Math.max(0, this._punch - 0.07);
                this._flash = Math.max(0, this._flash - 0.06);
                const s = (1 + 0.05 * this._focus - 0.07 * this._press + 0.10 * Math.sin(this._punch * Math.PI)) *
                    (0.92 + 0.08 * this._appear);
                this.scale.set(s);
                this.opacity = Math.round(255 * this._appear);
            }

            updateFx() {
                let dirty = false;
                if (this._shineT >= 0) {
                    this._shineT += 0.06;
                    if (this._shineT >= 1) this._shineT = -1;
                    dirty = true;
                }
                if (this._ripple >= 0) {
                    this._ripple += 0.045;
                    if (this._ripple >= 1) this._ripple = -1;
                    dirty = true;
                }
                if (dirty || this._fxDirty) {
                    this.drawFx();
                    this._fxDirty = dirty;   // 消えた直後にもう一度描いて空にする
                }
            }

            drawFx() {
                const bmp = this._fx.bitmap;
                const ctx = bmp.context;
                const w = this._w, h = this._h;
                bmp.clear();
                this.withShape(ctx, 3, () => {
                    if (this._shineT >= 0) {
                        const x = -30 + (w + 60) * this._shineT;
                        ctx.save();
                        ctx.translate(x, 0);
                        ctx.transform(1, 0, -0.45, 1, 0, 0);
                        const g = ctx.createLinearGradient(-14, 0, 14, 0);
                        g.addColorStop(0, "rgba(255,255,255,0)");
                        g.addColorStop(0.5, "rgba(255,255,255,0.55)");
                        g.addColorStop(1, "rgba(255,255,255,0)");
                        ctx.fillStyle = g;
                        ctx.fillRect(-14, -10, 28, h + 20);
                        ctx.restore();
                    }
                    if (this._ripple >= 0) {
                        const t = this._ripple;
                        const rad = 6 + Math.max(w, h) * 1.1 * (1 - Math.pow(1 - t, 2));
                        const a = 0.85 * (1 - t);
                        ctx.beginPath();
                        ctx.arc(this._rx, this._ry, rad, 0, Math.PI * 2);
                        ctx.lineWidth = 3 + 4 * (1 - t);
                        ctx.strokeStyle = "rgba(255,255,255," + a.toFixed(3) + ")";
                        ctx.stroke();
                        ctx.fillStyle = "rgba(255,255,255," + (a * 0.18).toFixed(3) + ")";
                        ctx.fill();
                    }
                });
                bmp._baseTexture.update();
            }

            updateLook() {
                // 画像の切り替え(押下 > フォーカス > 通常)
                let bmp = this._normalBmp;
                if (this._enabled && this._pressTarget && this._pressBmp) bmp = this._pressBmp;
                else if (this._enabled && this._focusTarget && this._focusBmp) bmp = this._focusBmp;
                if (bmp !== this._shownBitmap) {
                    this._shownBitmap = bmp;
                    this._base.bitmap = bmp;
                }
                // 色味: 決定時=白フラッシュ / フォーカス=ほんのり明るく / 押下=暗く
                const white = Math.min(230, this._focus * 26 + this._flash * 190);
                if (white > 0.5) this._base.setBlendColor([255, 255, 255, white]);
                else this._base.setBlendColor([0, 0, 0, this._press * 70]);
                // 無効時はグレー
                if (this._enabled) {
                    this._base.setColorTone([0, 0, 0, 0]);
                    this._base.alpha = 1;
                } else {
                    this._base.setColorTone([0, 0, 0, 255]);
                    this._base.alpha = 0.6;
                }
                // 縁の光: フォーカス中はゆっくり脈打つ
                if (this._glow) {
                    const pulse = 0.72 + 0.28 * Math.sin(this._age / 6);
                    this._glow.opacity = Math.round(255 * this._focus * pulse);
                }
            }
        }

        class Sprite_WheelButtons extends Sprite {
            initialize() {
                super.initialize();
                this._buttons = BTN_RECTS.map((_, i) => {
                    const b = new Sprite_WheelButton(i);
                    this.addChild(b);
                    return b;
                });
                this._pressIdx = -1;
                this._focusIdx = -1;
                this._kb = -1;          // キーボード/パッドのフォーカス(-1:なし)
                this._lastX = TouchInput.x;
                this._lastY = TouchInput.y;
                this._dim = 0;
            }

            setEnabled(index, enabled) {
                const b = this._buttons[index];
                if (b) b.setEnabled(enabled);
            }

            hitIndex(p) {
                for (let i = 0; i < this._buttons.length; i++) {
                    const b = this._buttons[i];
                    if (b._enabled && b.hitTest(p.x - b._rect.x0, p.y - b._rect.y0)) return i;
                }
                return -1;
            }

            update() {
                super.update();
                const scene = SceneManager._scene;
                const windowBusy = !scene ||
                    (scene.isAnyInputWindowActive && scene.isAnyInputWindowActive()) ||
                    $gameMessage.isBusy() || BattleManager.isBattleEnd();
                this._dim += ((windowBusy ? 1 : 0) - this._dim) * 0.15;
                this.alpha = 1 - 0.45 * this._dim;
                const inputOk = !windowBusy && !wheelDragging && !wazaBusy;
                this.updateInput(inputOk, scene);
            }

            updateInput(inputOk, scene) {
                const tx = TouchInput.x, ty = TouchInput.y;
                const moved = tx !== this._lastX || ty !== this._lastY;
                this._lastX = tx;
                this._lastY = ty;
                const onBottom = TouchInput.screen() === "bottom";
                if (moved && onBottom) this._kb = -1;   // ポインタ操作に戻る

                // キーボード / ゲームパッドでのフォーカス移動
                let decideKey = false;
                if (inputOk) {
                    const dirs = [
                        ["left",  i => (i % 2 === 1 ? i - 1 : i)],
                        ["right", i => (i % 2 === 0 ? i + 1 : i)],
                        ["up",    i => (i >= 2 ? i - 2 : i)],
                        ["down",  i => (i < 2 ? i + 2 : i)]
                    ];
                    for (const [key, fn] of dirs) {
                        if (Input.isTriggered(key)) {
                            this._kb = this._kb < 0 ? 0 : fn(this._kb);
                        }
                    }
                    if (this._kb >= 0 && Input.isTriggered("ok")) decideKey = true;
                } else if (!inputOk) {
                    this._kb = -1;
                }

                // フォーカス中のボタンを決める
                const local = TouchInput.localPosition("bottom");
                let idx = -1;
                if (inputOk) {
                    if (this._kb >= 0) {
                        idx = this._kb;
                    } else if (onBottom && (!Utils.isMobileDevice() || TouchInput.isPressed())) {
                        idx = this.hitIndex(local);
                    }
                }
                if (this._kb >= 0 && !this._buttons[this._kb]._enabled) idx = -1;

                // 押している最中に指が離れた/外れた場合の処理
                if (this._pressIdx >= 0) {
                    const pressed = TouchInput.isPressed() && inputOk;
                    const over = idx === this._pressIdx;
                    this._buttons[this._pressIdx].setPress(pressed && over);
                    if (!TouchInput.isPressed() || !inputOk) {
                        if (inputOk && over) this.decide(this._pressIdx, scene);
                        this._buttons[this._pressIdx].setPress(false);
                        this._pressIdx = -1;
                    }
                }

                // フォーカスの更新(カーソルSE)
                if (idx !== this._focusIdx) {
                    if (idx >= 0 && BTN_SE) SoundManager.playCursor();
                    this._focusIdx = idx;
                }
                this._buttons.forEach((b, i) => b.setFocus(i === idx));

                // 押し始め
                if (inputOk && idx >= 0 && this._kb < 0 && TouchInput.isTriggered() && this._pressIdx < 0) {
                    this._pressIdx = idx;
                    const b = this._buttons[idx];
                    b.setPress(true, local.x - b._rect.x0, local.y - b._rect.y0);
                }
                if (decideKey && idx >= 0) this.decide(idx, scene);
            }

            decide(index, scene) {
                const b = this._buttons[index];
                if (!b || !b._enabled) return;
                b.decide();
                if (BTN_SE) SoundManager.playOk();
                if (scene && scene.onWheelButton) scene.onWheelButton(index, b._def.label);
            }
        }

        // 押したときの処理(未実装): 必要に応じて上書きしてください
        if (!Scene_Battle.prototype.onWheelButton) {
            Scene_Battle.prototype.onWheelButton = function(index, label) {};
        }
        Scene_Battle.prototype.setWheelButtonEnabled = function(index, enabled) {
            if (this._wheelButtons) this._wheelButtons.setEnabled(index, enabled);
        };


        //-------------------------------------------------------------------------
        // わざ: キャラ選択 → タイミングゲージ → 強制行動(ダメージ倍率つき)
        //-------------------------------------------------------------------------
        const WZ = {
            enabled: P.wazaEnabled !== "false",
            defaultSkill: Number(P.wazaDefaultSkillId || 0),
            riseSec: Math.max(0.2, Number(P.wazaRiseSec || 0.85)),
            cycles: Math.max(1, Number(P.wazaCycles || 3)),
            minRate: Number(P.wazaMinRate ?? 0.5),
            maxRate: Number(P.wazaMaxRate ?? 1.5),
            perfectRate: Number(P.wazaPerfectRate ?? 2.0),
            perfectWidth: Math.max(0, Math.min(0.5, Number(P.wazaPerfectWidth ?? 0.06))),
            curve: Math.max(0.2, Number(P.wazaCurve || 2.0)),
            minStamina: Math.max(0, Number(P.wazaMinStamina ?? 1))
        };
        const wzSeParam = key => ({
            name: String(P[key] || ""),
            volume: Number(P[key + "Volume"] ?? 90),
            pitch: Number(P[key + "Pitch"] ?? 100),
            pan: Number(P[key + "Pan"] ?? 0)
        });
        WZ.seStop = wzSeParam("wazaSeStop");
        WZ.sePerfect = wzSeParam("wazaSePerfect");
        // 指定があればその効果音、なければ fallback(システム効果音)を鳴らす
        const wzPlaySe = (se, fallback) => {
            if (se.name) AudioManager.playSe({ name: se.name, volume: se.volume, pitch: se.pitch, pan: se.pan });
            else if (fallback) fallback();
        };

        // アクターごとの「わざ」スキル: メモ欄 <わざ:ID> / <waza:ID> → 既定 → 最初の習得スキル
        const wazaSkillIdOf = actor => {
            const note = actor.actor() ? actor.actor().note : "";
            const m = /<(?:わざ|waza)\s*:\s*(\d+)\s*>/i.exec(note);
            if (m) return Number(m[1]);
            if (WZ.defaultSkill > 0) return WZ.defaultSkill;
            const learned = actor.skills().find(sk => sk.id !== actor.attackSkillId() && sk.id !== actor.guardSkillId());
            return learned ? learned.id : actor.attackSkillId();
        };

        // その時点で選べるか / 理由 / 消費スタミナ
        const wazaInfo = actor => {
            const skillId = wazaSkillIdOf(actor);
            const skill = $dataSkills[skillId];
            // わざは「残りスタミナを全部」消費して撃つ
            const stamina = actor.battleStamina ? actor.battleStamina() : 0;
            const cost = stamina;
            let reason = "";
            if (!skill) reason = "わざなし";
            else if (!actor.isAlive()) reason = "たたかえない";
            else if (!actor.canMove()) reason = "うごけない";
            else if (!actor.canUse(skill)) reason = "つかえない";
            else if (stamina < WZ.minStamina || stamina <= 0 && WZ.minStamina > 0) reason = "スタミナぶそく";
            return { skillId, skill, cost, reason, ok: reason === "" };
        };

        // ゲージの位置(0〜1)→ダメージ倍率
        const wazaRateOf = level => {
            if (level >= 1 - WZ.perfectWidth) return WZ.perfectRate;
            const t = Math.pow(Math.max(0, Math.min(1, level / Math.max(0.0001, 1 - WZ.perfectWidth))), WZ.curve);
            return WZ.minRate + (WZ.maxRate - WZ.minRate) * t;
        };

        // わざ(_wazaAll)の行動は、その時点の残りスタミナを全て消費する(既存の消費処理がこの値を使う)
        const _GA_staminaActionCost = Game_Actor.prototype.staminaActionCost;
        Game_Actor.prototype.staminaActionCost = function(action) {
            if (action && action._wazaAll) return this.battleStamina();
            return _GA_staminaActionCost.call(this, action);
        };

        // 倍率をダメージに反映(強制行動に付けた _wazaRate)
        const _GA_makeDamageValue = Game_Action.prototype.makeDamageValue;
        Game_Action.prototype.makeDamageValue = function(target, critical) {
            let value = _GA_makeDamageValue.call(this, target, critical);
            if (this._wazaRate && this._wazaRate !== 1) value = Math.round(value * this._wazaRate);
            return value;
        };

        // ---- 文字・図形の小道具 ----
        const wzRoundRect = (ctx, x, y, w, h, r) => {
            if (UI.solid) { uiChamfer(ctx, x, y, w, h, Math.max(1.5, Math.min(7, r * 0.55))); return; }
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        };

        const wzText = (bmp, text, x, y, w, size, align = "center", color = "#fff", outline = "rgba(10,25,70,0.95)") => {
            const prev = uiCat;
            uiCat = "waza";
            try { rsText(bmp, text, x, y, w, size, align, color, outline); } finally { uiCat = prev; }
        };

        // ---- 縦長のタイミングゲージ ----
        class Sprite_WazaGauge extends Sprite {
            initialize() {
                super.initialize();
                this._gw = 60;
                this._gh = 212;
                this._seg = 22;
                this._level = 0;
                this._flash = 0;
                this._age = 0;
                this._stopped = false;
                this.bitmap = new Bitmap(this._gw, this._gh);
                this.anchor.set(0.5);
                this.draw();
            }

            setLevel(v, stopped) {
                this._level = v;
                this._stopped = !!stopped;
            }

            flash() { this._flash = 1; }

            update() {
                super.update();
                this._age++;
                this._flash = Math.max(0, this._flash - 0.05);
                this.draw();
            }

            segColor(i, bright) {
                // 下=緑 → 中=黄 → 上=橙〜赤
                const t = i / (this._seg - 1);
                const hue = t < 0.55 ? 125 - (125 - 52) * (t / 0.55) : 52 - (52 - 8) * ((t - 0.55) / 0.45);
                return "hsl(" + Math.round(hue) + ",95%," + (bright ? 58 : 46) + "%)";
            }

            // ソリッド: 暗い枠(橙の外枠)+ 平らな色の分割ゲージ
            drawSolid() {
                const bmp = this.bitmap, ctx = bmp.context, W = this._gw, H = this._gh;
                bmp.clear();
                const fx = 8, fy = 6, fw = W - 16, fh = H - 12;
                uiPanel(ctx, fx, fy, fw, fh, { c: 6, border: UI.accent, bw: 2 });
                const wx = fx + 7, wy = fy + 7, ww = fw - 14, wh = fh - 14;
                ctx.fillStyle = "#050608";
                ctx.fillRect(wx, wy, ww, wh);
                const n = this._seg, gap = 2;
                const sh = (wh - 4 - gap * (n - 1)) / n;
                const filled = this._level * n;
                const perfFrom = Math.floor(n * (1 - WZ.perfectWidth - 0.0001));
                for (let i = 0; i < n; i++) {
                    const y = wy + wh - 2 - (i + 1) * sh - i * gap;
                    const on = filled >= i + 1 ? 1 : Math.max(0, Math.min(1, filled - i));
                    ctx.fillStyle = "rgba(255,255,255,0.06)";
                    ctx.fillRect(wx + 2, y, ww - 4, sh);
                    if (on > 0) {
                        ctx.globalAlpha = on;
                        ctx.fillStyle = this.segColor(i, false);
                        ctx.fillRect(wx + 2, y, ww - 4, sh);
                        ctx.globalAlpha = 1;
                    }
                }
                const topY = wy + 2;
                const perfH = (n - perfFrom) * (sh + gap) - gap;
                const pulse = 0.55 + 0.45 * Math.sin(this._age / 4);
                ctx.strokeStyle = "rgba(255,226,120," + (0.65 + 0.35 * pulse).toFixed(2) + ")";
                ctx.lineWidth = 2;
                ctx.strokeRect(wx + 1, topY - 1, ww - 2, perfH + 2);
                ctx.fillStyle = UI.accent;                    // 頂点マーカー
                const my = topY + perfH / 2;
                ctx.beginPath(); ctx.moveTo(fx - 3, my - 6); ctx.lineTo(fx - 3, my + 6); ctx.lineTo(fx + 6, my); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(fx + fw + 3, my - 6); ctx.lineTo(fx + fw + 3, my + 6); ctx.lineTo(fx + fw - 6, my); ctx.closePath(); ctx.fill();
                const cy = wy + wh - 2 - this._level * (wh - 4);   // 現在位置の線
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(wx, cy - 1.5, ww, 3);
                if (this._flash > 0) {
                    uiChamfer(ctx, fx, fy, fw, fh, 6);
                    ctx.fillStyle = "rgba(255,255,255," + (0.55 * this._flash).toFixed(2) + ")";
                    ctx.fill();
                }
                bmp._baseTexture.update();
            }

            draw() {
                if (UI.solid) return this.drawSolid();
                const bmp = this.bitmap;
                const ctx = bmp.context;
                const W = this._gw, H = this._gh;
                bmp.clear();
                const fx = 8, fy = 6, fw = W - 16, fh = H - 12;
                // 外枠(赤い縁+白い縁)
                wzRoundRect(ctx, fx, fy, fw, fh, 12);
                ctx.fillStyle = "#3a0a14";
                ctx.fill();
                wzRoundRect(ctx, fx + 2, fy + 2, fw - 4, fh - 4, 10);
                const og = ctx.createLinearGradient(0, fy, 0, fy + fh);
                og.addColorStop(0, "#ff5a68");
                og.addColorStop(1, "#a4152a");
                ctx.fillStyle = og;
                ctx.fill();
                wzRoundRect(ctx, fx + 6, fy + 6, fw - 12, fh - 12, 7);
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.fill();
                // 井戸(暗い溝)
                const wx = fx + 8, wy = fy + 8, ww = fw - 16, wh = fh - 16;
                wzRoundRect(ctx, wx, wy, ww, wh, 5);
                ctx.fillStyle = "#14090f";
                ctx.fill();

                // セグメント
                const n = this._seg, gap = 2;
                const sh = (wh - 6 - gap * (n - 1)) / n;
                const filled = this._level * n;
                const perfFrom = Math.floor(n * (1 - WZ.perfectWidth - 0.0001));
                for (let i = 0; i < n; i++) {
                    const y = wy + wh - 3 - (i + 1) * sh - i * gap;
                    const on = filled >= i + 1 ? 1 : Math.max(0, Math.min(1, filled - i));
                    const x = wx + 3, w = ww - 6;
                    // 空の枠
                    ctx.fillStyle = "rgba(255,255,255,0.07)";
                    ctx.fillRect(x, y, w, sh);
                    if (on > 0) {
                        const grad = ctx.createLinearGradient(0, y, 0, y + sh);
                        grad.addColorStop(0, this.segColor(i, true));
                        grad.addColorStop(1, this.segColor(i, false));
                        ctx.globalAlpha = on;
                        ctx.fillStyle = grad;
                        ctx.fillRect(x, y, w, sh);
                        ctx.fillStyle = "rgba(255,255,255,0.35)";
                        ctx.fillRect(x, y, w, Math.max(1, sh * 0.25));
                        ctx.globalAlpha = 1;
                    }
                }

                // パーフェクト帯(最上段): 金色の囲いとキラキラ
                const topY = wy + 3;
                const perfH = (n - perfFrom) * (sh + gap) - gap;
                const pulse = 0.55 + 0.45 * Math.sin(this._age / 4);
                ctx.save();
                ctx.strokeStyle = "rgba(255,226,100," + (0.65 + 0.35 * pulse).toFixed(2) + ")";
                ctx.shadowColor = "#fff0a0";
                ctx.shadowBlur = 8;
                ctx.lineWidth = 2;
                ctx.strokeRect(wx + 1.5, topY - 1, ww - 3, perfH + 2);
                ctx.restore();
                // 頂点マーカー(左右の三角)
                ctx.fillStyle = "#ffe36a";
                const my = topY + perfH / 2;
                ctx.beginPath(); ctx.moveTo(fx - 2, my - 6); ctx.lineTo(fx - 2, my + 6); ctx.lineTo(fx + 7, my); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(fx + fw + 2, my - 6); ctx.lineTo(fx + fw + 2, my + 6); ctx.lineTo(fx + fw - 7, my); ctx.closePath(); ctx.fill();

                // 現在位置の線(ゲージ先端)
                const cy = wy + wh - 3 - this._level * (wh - 6);
                ctx.save();
                ctx.shadowColor = "#ffffff";
                ctx.shadowBlur = 6;
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(wx + 1, cy - 1.5, ww - 2, 3);
                ctx.restore();

                // 停止時のフラッシュ
                if (this._flash > 0) {
                    wzRoundRect(ctx, fx, fy, fw, fh, 12);
                    ctx.fillStyle = "rgba(255,255,255," + (0.6 * this._flash).toFixed(2) + ")";
                    ctx.fill();
                }
                bmp._baseTexture.update();
            }
        }

        // ---- ホイール中央のハブ = 「止める」ボタン ----
        class Sprite_WazaHub extends Sprite {
            initialize() {
                super.initialize();
                this._R = HUB_R + 12;                 // 元のハブより一回り大きく
                const size = (this._R + 26) * 2;
                this._c = size / 2;
                this.bitmap = new Bitmap(size, size);
                this.anchor.set(0.5);
                this.x = WX;
                this.y = WY;
                this._age = 0;
                this._focus = 0;
                this._focusTarget = false;
                this._press = 0;
                this._pressTarget = false;
                this._burst = -1;
                this._enabled = true;
                this._text = "PUSH";
            }

            // ホイール中心からの距離で当たり判定(下画面ローカル座標)
            hitTest(p) {
                return Math.hypot(p.x - WX, p.y - WY) <= this._R + 2;
            }

            setFocus(v) { this._focusTarget = v; }
            setPress(v) { this._pressTarget = v; }
            setEnabled(v) { this._enabled = v; }
            burst() { this._burst = 0; }

            update() {
                super.update();
                this._age++;
                this._focus += Math.max(-0.2, Math.min(0.2, (this._focusTarget ? 1 : 0) - this._focus));
                this._press += Math.max(-0.35, Math.min(0.35, (this._pressTarget ? 1 : 0) - this._press));
                if (this._burst >= 0) {
                    this._burst += 0.05;
                    if (this._burst >= 1) this._burst = -1;
                }
                this.scale.set(1 + 0.08 * this._focus - 0.1 * this._press);
                this.draw();
            }

            // ソリッド: 暗い台座 + アクセントのリング + 橙のレンズ。呼びかけの波紋は同じ
            drawSolid() {
                const bmp = this.bitmap, ctx = bmp.context;
                const c = this._c, R = this._R;
                bmp.clear();
                const on = this._enabled;
                if (on) {
                    for (let k = 0; k < 2; k++) {
                        const t = ((this._age + k * 30) % 60) / 60;
                        ctx.beginPath();
                        ctx.arc(c, c, R + 2 + t * 22, 0, Math.PI * 2);
                        ctx.lineWidth = 3 * (1 - t) + 1;
                        ctx.strokeStyle = "rgba(240,138,36," + (0.75 * (1 - t)).toFixed(2) + ")";
                        ctx.stroke();
                    }
                }
                if (this._burst >= 0) {
                    const t = this._burst;
                    ctx.beginPath();
                    ctx.arc(c, c, R + 4 + t * 24, 0, Math.PI * 2);
                    ctx.lineWidth = 6 * (1 - t) + 1;
                    ctx.strokeStyle = "rgba(255,255,255," + (0.95 * (1 - t)).toFixed(2) + ")";
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(c, c, R, 0, Math.PI * 2);
                ctx.fillStyle = "#0a0b0e";
                ctx.fill();
                ctx.lineWidth = 3;
                ctx.strokeStyle = on ? UI.accent : "#4a4f5a";
                ctx.stroke();
                for (let k = 0; k < 24; k++) {                      // 外周の目盛り
                    const a = k * Math.PI / 12;
                    ctx.strokeStyle = on ? "rgba(240,138,36,0.5)" : "rgba(120,125,135,0.4)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(c + Math.cos(a) * (R - 6), c + Math.sin(a) * (R - 6));
                    ctx.lineTo(c + Math.cos(a) * (R - 3), c + Math.sin(a) * (R - 3));
                    ctx.stroke();
                }
                const lr = R - 9;
                const lens = ctx.createLinearGradient(0, c - lr, 0, c + lr);
                if (on) {
                    lens.addColorStop(0, uiShade(UI.accent, 0.1 + 0.25 * this._focus - 0.2 * this._press));
                    lens.addColorStop(1, uiShade(UI.accent, -0.5 - 0.1 * this._press));
                } else {
                    lens.addColorStop(0, "#5c606a");
                    lens.addColorStop(1, "#2a2d34");
                }
                ctx.beginPath();
                ctx.arc(c, c, lr, 0, Math.PI * 2);
                ctx.fillStyle = lens;
                ctx.fill();
                if (this._focus > 0.01) {
                    ctx.beginPath();
                    ctx.arc(c, c, R + 1, 0, Math.PI * 2);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "rgba(255,226,188," + (0.9 * this._focus).toFixed(2) + ")";
                    ctx.stroke();
                }
                bmp._baseTexture.update();
                if (this._text) wzText(bmp, this._text, c - R, c - 9, R * 2, 13, "center", "#fff");
            }

            draw() {
                if (UI.solid) return this.drawSolid();
                const bmp = this.bitmap;
                const ctx = bmp.context;
                const c = this._c, R = this._R;
                bmp.clear();
                const on = this._enabled;

                // 呼びかけの波紋(押してほしいサイン): 2本を位相をずらして外へ広げる
                if (on) {
                    for (let k = 0; k < 2; k++) {
                        const t = ((this._age + k * 30) % 60) / 60;
                        ctx.beginPath();
                        ctx.arc(c, c, R + 2 + t * 22, 0, Math.PI * 2);
                        ctx.lineWidth = 3 * (1 - t) + 1;
                        ctx.strokeStyle = "rgba(255,226,100," + (0.7 * (1 - t)).toFixed(2) + ")";
                        ctx.stroke();
                    }
                }
                // 決定時のバースト
                if (this._burst >= 0) {
                    const t = this._burst;
                    ctx.beginPath();
                    ctx.arc(c, c, R + 4 + t * 24, 0, Math.PI * 2);
                    ctx.lineWidth = 6 * (1 - t) + 1;
                    ctx.strokeStyle = "rgba(255,255,255," + (0.95 * (1 - t)).toFixed(2) + ")";
                    ctx.stroke();
                }
                // 影
                ctx.beginPath();
                ctx.arc(c, c + 2, R + 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0,0,0,0.45)";
                ctx.fill();
                // 金属の縁
                const metal = ctx.createLinearGradient(c - R, c - R, c + R, c + R);
                metal.addColorStop(0, "#f7f9ff");
                metal.addColorStop(0.5, "#98a0b8");
                metal.addColorStop(1, "#383c50");
                ctx.beginPath();
                ctx.arc(c, c, R, 0, Math.PI * 2);
                ctx.fillStyle = metal;
                ctx.fill();
                // レンズ(押せる色: 橙〜赤。フォーカス/押下で明るく/暗く)
                const lr = R - 6;
                const bright = 0.5 + 0.5 * Math.sin(this._age / 8);
                const lens = ctx.createRadialGradient(c - lr * 0.3, c - lr * 0.35, 1, c, c, lr);
                if (on) {
                    lens.addColorStop(0, "hsl(45,100%," + Math.round(72 + 10 * this._focus + 6 * bright - 18 * this._press) + "%)");
                    lens.addColorStop(0.55, "hsl(20,95%," + Math.round(52 - 10 * this._press) + "%)");
                    lens.addColorStop(1, "hsl(2,85%,32%)");
                } else {
                    lens.addColorStop(0, "#c8ccd6");
                    lens.addColorStop(1, "#555a66");
                }
                ctx.beginPath();
                ctx.arc(c, c, lr, 0, Math.PI * 2);
                ctx.fillStyle = lens;
                ctx.fill();
                // 光沢
                ctx.save();
                ctx.beginPath();
                ctx.arc(c, c, lr, 0, Math.PI * 2);
                ctx.clip();
                const gl = ctx.createLinearGradient(0, c - lr, 0, c);
                gl.addColorStop(0, "rgba(255,255,255,0.55)");
                gl.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = gl;
                ctx.fillRect(c - lr, c - lr, lr * 2, lr);
                ctx.restore();
                // フォーカス時の発光
                if (this._focus > 0.01) {
                    ctx.beginPath();
                    ctx.arc(c, c, R + 1, 0, Math.PI * 2);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "rgba(255,240,150," + (0.9 * this._focus).toFixed(2) + ")";
                    ctx.shadowColor = "#fff2a0";
                    ctx.shadowBlur = 10;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
                bmp._baseTexture.update();
                if (this._text) wzText(bmp, this._text, c - R, c - 9, R * 2, 13, "center", "#fff", "rgba(90,15,0,0.95)");
            }
        }

        // ---- わざUI本体 ----
        class Sprite_WazaUi extends Sprite {
            initialize(scene, onClose) {
                super.initialize();
                this._scene = scene;
                this._onClose = onClose;
                this._age = 0;
                this._phase = "select";
                this._focus = -1;
                this._prevHit = -2;
                this._closing = false;
                this._fade = 0;
                this._info = [];
                this._members = [];
                this._shake = 0;
                const W = CFG.botW, H = CFG.botH;
                // 背景
                const bg = new Bitmap(W, H);
                const ctx = bg.context;
                const g = ctx.createLinearGradient(0, 0, 0, H);
                g.addColorStop(0, UI.solid ? "rgba(10,11,14,0.94)" : "rgba(12,18,48,0.95)");
                g.addColorStop(1, UI.solid ? "rgba(4,5,7,0.97)" : "rgba(6,8,24,0.97)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
                bg._baseTexture.update();
                this._bg = new Sprite(bg);
                this._bg.alpha = 0;
                this._bgTarget = 0.4;            // 選択中はホイールをはっきり見せる
                this.addChild(this._bg);

                this._title = new Sprite(new Bitmap(W, 24));
                this._title.y = 2;
                this.addChild(this._title);
                this.setTitle("ホイールから だれが わざを だす?");

                this.buildSeats();
                this.buildBackButton();

                this._stage = new Sprite();       // ゲージ画面用の部品置き場
                this._stage.visible = false;
                this.addChild(this._stage);

                this.alpha = 0;
            }

            setTitle(text) {
                const bmp = this._title.bitmap;
                bmp.clear();
                wzText(bmp, text, 0, 0, bmp.width, 15);
            }

            // ホイール上の前衛を選ぶための部品(金枠/暗幕/情報行)
            buildSeats() {
                this._members = $gameParty.battleMembers();
                this._info = this._members.map(a => wazaInfo(a));
                const size = DISC_R * 2 + 6;
                this._overlay = new Sprite(new Bitmap(size, size));
                this._overlay.anchor.set(0.5);
                this._overlay.x = WX;
                this._overlay.y = WY;
                this.addChild(this._overlay);
                this._infoLine = new Sprite(new Bitmap(256, 22));
                this._infoLine.y = CFG.botH - 24;
                this.addChild(this._infoLine);
                this._infoKey = null;
            }

            buildBackButton() {
                const w = 58, h = 22;
                const bmp = new Bitmap(w, h);
                const ctx = bmp.context;
                wzRoundRect(ctx, 0, 0, w, h, 11);
                ctx.fillStyle = "#0d1a36";
                ctx.fill();
                wzRoundRect(ctx, 2, 2, w - 4, h - 4, 9);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, UI.solid ? "#8a919e" : "#9aa6c8");
                g.addColorStop(1, UI.solid ? "#454b57" : "#5a6488");
                ctx.fillStyle = g;
                ctx.fill();
                bmp._baseTexture.update();
                wzText(bmp, "もどる", 0, 1, w, 12);
                this._back = new Sprite(bmp);
                this._back.anchor.set(0.5);
                this._back.x = CFG.botW - w / 2 - 4;
                this._back.y = CFG.botH - h / 2 - 3;
                this._back._rect = { x0: this._back.x - w / 2, y0: this._back.y - h / 2, x1: this._back.x + w / 2, y1: this._back.y + h / 2 };
                this.addChild(this._back);
            }

            inBack(p) {
                const b = this._back._rect;
                return p.x >= b.x0 && p.x < b.x1 && p.y >= b.y0 && p.y < b.y1;
            }

            // ホイール上のどの前衛の区画か(戻り値: this._members の添字 / -1)
            seatAt(p) {
                const dx = p.x - WX, dy = p.y - WY;
                const r = Math.hypot(dx, dy);
                if (r < HUB_R * 0.9 || r > DISC_R) return -1;
                const ang = Math.atan2(dx, -dy);   // 真上=0、時計回りが正(actorAngle と同じ向き)
                for (let i = 0; i < this._members.length; i++) {
                    let d = ang - actorAngle(this._members[i]);
                    d = ((d + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
                    if (Math.abs(d) <= STEP / 2) return i;
                }
                return -1;
            }

            // 左→右の並び(キー操作用)
            seatOrder() {
                return this._members.map((a, i) => ({ i, x: Math.sin(actorAngle(a)) }))
                    .sort((a, b) => a.x - b.x).map(o => o.i);
            }

            // ---- 更新 ----
            update() {
                super.update();
                this._age++;
                if (this._closing) {
                    this._fade = Math.max(0, this._fade - 0.12);
                    this.alpha = this._fade;
                    if (this._fade <= 0) this.finish();
                    return;
                }
                this._fade = Math.min(1, this._fade + 0.12);
                this.alpha = this._fade;
                const bgT = this._bgTarget ?? 1;
                this._bg.alpha += (bgT - this._bg.alpha) * 0.2;
                if (this._phase === "select") this.updateSelect();
                else if (this._phase === "gauge") this.updateGauge();
                else if (this._phase === "result") this.updateResult();
            }

            updateSelect() {
                const p = TouchInput.localPosition("bottom");
                const onBottom = TouchInput.screen() === "bottom";
                const seat = onBottom ? this.seatAt(p) : -1;
                const back = onBottom && this.inBack(p);
                const hit = back ? 99 : seat;
                if (this._prevHit === -2) this._prevHit = hit;
                const entered = hit >= 0 && hit !== this._prevHit;
                this._prevHit = hit;

                // 左右キー / 十字キー: 前衛を左→右に巡回
                const order = this.seatOrder();
                if (order.length > 0) {
                    const step = dir => {
                        const pos = order.indexOf(this._focus);
                        const next = pos < 0 ? (dir > 0 ? 0 : order.length - 1) : (pos + dir + order.length) % order.length;
                        this.moveFocus(order[next]);
                    };
                    if (Input.isTriggered("right")) step(1);
                    if (Input.isTriggered("left")) step(-1);
                }
                // ポインタ: 区画に入ったらフォーカス
                if (entered && hit >= 0 && hit < 99) this.moveFocus(hit);
                this._back.scale.set(back ? 1.08 : 1);

                // 決定 / 戻る
                if (this._age > 6) {
                    if (TouchInput.isTriggered() && hit >= 0) {
                        if (hit === 99) return this.cancel();
                        this.choose(hit);
                    } else if (Input.isTriggered("ok") && this._focus >= 0) {
                        this.choose(this._focus);
                    } else if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
                        return this.cancel();
                    }
                }
                this.drawOverlay();
                this.drawInfo();
            }

            moveFocus(i) {
                if (i === this._focus) return;
                this._focus = i;
                SoundManager.playCursor();
            }

            // ホイール上に枠・暗幕を重ねる(前衛=金枠 / 後衛=暗く / 選べない=暗く+×)
            drawOverlay() {
                const bmp = this._overlay.bitmap;
                const ctx = bmp.context;
                const c = bmp.width / 2;
                const r0 = HUB_R + 2, r1 = DISC_R - 3;
                bmp.clear();
                for (const actor of $gameParty.wheelMembers()) {
                    const ang = actorAngle(actor);
                    const mid = ang - Math.PI / 2;
                    const a0 = mid - STEP / 2 + 0.03, a1 = mid + STEP / 2 - 0.03;
                    const wedge = () => {
                        ctx.beginPath();
                        ctx.arc(c, c, r1, a0, a1, false);
                        ctx.arc(c, c, r0, a1, a0, true);
                        ctx.closePath();
                    };
                    const idx = this._members.indexOf(actor);
                    if (idx < 0) {                       // 後衛
                        wedge();
                        ctx.fillStyle = "rgba(5,8,20,0.62)";
                        ctx.fill();
                        continue;
                    }
                    const info = this._info[idx];
                    if (!info.ok) {                      // 選べない
                        wedge();
                        ctx.fillStyle = "rgba(5,8,20,0.5)";
                        ctx.fill();
                        const px = c + Math.sin(ang) * WR, py = c - Math.cos(ang) * WR;
                        ctx.save();
                        ctx.strokeStyle = "#ff6a6a";
                        ctx.lineWidth = 5;
                        ctx.lineCap = "round";
                        ctx.shadowColor = "#000";
                        ctx.shadowBlur = 4;
                        ctx.beginPath();
                        ctx.moveTo(px - 9, py - 9); ctx.lineTo(px + 9, py + 9);
                        ctx.moveTo(px + 9, py - 9); ctx.lineTo(px - 9, py + 9);
                        ctx.stroke();
                        ctx.restore();
                        continue;
                    }
                    const focus = idx === this._focus;   // 選べる前衛
                    wedge();
                    if (focus) {
                        ctx.fillStyle = "rgba(255,255,255," + (0.16 + 0.08 * Math.sin(this._age / 4)).toFixed(2) + ")";
                        ctx.fill();
                    }
                    ctx.save();
                    ctx.lineWidth = focus ? 4 : 2.5;
                    ctx.strokeStyle = "rgba(255,226,100," + (focus ? 1 : 0.55 + 0.25 * Math.sin(this._age / 6)).toFixed(2) + ")";
                    ctx.shadowColor = "#fff2a0";
                    ctx.shadowBlur = focus ? 12 : 5;
                    ctx.stroke();
                    ctx.restore();
                }
                bmp._baseTexture.update();
            }

            // 下部の情報行(フォーカス中のキャラ)
            drawInfo() {
                const f = this._focus;
                const key = f + ":" + (f >= 0 ? this._info[f].reason + this._info[f].cost : "");
                if (key === this._infoKey) return;
                this._infoKey = key;
                const bmp = this._infoLine.bitmap;
                bmp.clear();
                if (f < 0) {
                    wzText(bmp, "ひかっている なかまを えらんでね", 0, 2, 256, 12, "center", "#cfe3ff");
                    return;
                }
                const a = this._members[f], info = this._info[f];
                if (!info.ok) {
                    wzText(bmp, a.name() + ": " + info.reason, 0, 2, 256, 12, "center", "#ffb0b0", "rgba(60,0,0,0.9)");
                } else {
                    const now = Math.floor(a.battleStamina());
                    const name = info.skill ? info.skill.name : "";
                    wzText(bmp, a.name() + " 「" + name + "」 SP " + now + "→" + Math.max(0, now - info.cost), 0, 2, 256, 12, "center", "#ffffff");
                }
            }

            cancel() {
                SoundManager.playCancel();
                this.close();
            }

            choose(i) {
                const info = this._info[i];
                if (!info.ok) {
                    SoundManager.playBuzzer();
                    this._focus = i;
                    return;
                }
                SoundManager.playOk();
                this._actor = this._members[i];
                this._skillInfo = info;
                this.startGauge();
            }

            // ---- ゲージ ----
            startGauge() {
                this._phase = "gauge";
                this._gaugeAge = 0;
                this._bgTarget = 0.72;               // ホイールがうっすら見えるようにする
                this._overlay.visible = false;
                this._infoLine.visible = false;
                this._back.visible = false;
                this.setTitle(this._skillInfo.skill ? this._skillInfo.skill.name : "わざ");
                const st = this._stage;
                st.visible = true;
                st.removeChildren();

                // ゲージ(左端)
                this._gauge = new Sprite_WazaGauge();
                this._gauge.x = 36;
                this._gauge.y = CFG.botH / 2 + 14;
                st.addChild(this._gauge);

                // 顔・名前・わざ名(右端)
                const panel = new Sprite(new Bitmap(60, 110));
                panel.x = CFG.botW - 62;
                panel.y = 38;
                const fb = ImageManager.loadFace(this._actor.faceName());
                const drawPanel = () => {
                    const ctx = panel.bitmap.context;
                    wzRoundRect(ctx, 2, 0, 56, 56, 9);
                    ctx.fillStyle = "#0d1a36";
                    ctx.fill();
                    ctx.save();
                    wzRoundRect(ctx, 4.5, 2.5, 51, 51, 7);
                    ctx.clip();
                    const idx = this._actor.faceIndex();
                    if (fb.width > 0) ctx.drawImage(ttElement(fb), (idx % 4) * 144, Math.floor(idx / 4) * 144, 144, 144, 4.5, 2.5, 51, 51);
                    ctx.restore();
                    panel.bitmap._baseTexture.update();
                    wzText(panel.bitmap, this._actor.name(), 0, 60, 60, 13);
                    wzText(panel.bitmap, this._skillInfo.skill ? this._skillInfo.skill.name : "", 0, 78, 60, 11, "center", "#ffe9a0", "rgba(60,30,0,0.9)");
                };
                fb.addLoadListener(drawPanel);
                st.addChild(panel);

                // ホイール中央のハブ = 止めるボタン
                this._hub = new Sprite_WazaHub();
                st.addChild(this._hub);
                this._hubPrev = -2;

                // 案内(ハブの下)
                this._hint = new Sprite(new Bitmap(180, 46));
                this._hint.x = WX - 90;
                this._hint.y = WY + 42;
                st.addChild(this._hint);
                this._hintAge = 0;
                this.drawHint();

                // 結果表示(ハブの上)
                this._resultSprite = new Sprite(new Bitmap(CFG.botW, 64));
                this._resultSprite.y = 30;
                this._resultSprite.opacity = 0;
                st.addChild(this._resultSprite);
            }

            drawHint() {
                const bmp = this._hint.bitmap;
                bmp.clear();
                const pulse = 0.5 + 0.5 * Math.sin(this._hintAge / 5);
                wzText(bmp, "ちょうてんで まんなかを", 0, 0, 180, 13, "center", "#fff");
                wzText(bmp, "おして!", 0, 17, 180, 18, "center", pulse > 0.5 ? "#ffe36a" : "#fff");
            }

            gaugeLevel() {
                const half = WZ.riseSec * 60;
                const p = (this._gaugeAge / half) % 2;
                return p <= 1 ? p : 2 - p;
            }

            updateGauge() {
                this._gaugeAge++;
                this._hintAge++;
                if (this._hintAge % 3 === 0) this.drawHint();
                const level = this.gaugeLevel();
                this._gauge.setLevel(level, false);
                this._level = level;

                // ホイール中央のハブ: ホバー / 押下
                const p = TouchInput.localPosition("bottom");
                const onBottom = TouchInput.screen() === "bottom";
                const overHub = onBottom && this._hub.hitTest(p);
                this._hub.setFocus(overHub);
                this._hub.setPress(overHub && TouchInput.isPressed());
                if (overHub && this._hubPrev !== 1) {
                    if (this._hubPrev !== -2) SoundManager.playCursor();
                }
                this._hubPrev = overHub ? 1 : 0;

                const timeout = WZ.riseSec * 60 * 2 * WZ.cycles;
                if (this._gaugeAge > 10) {
                    // 止める: ハブをクリック/タッチ、または決定キー
                    if ((TouchInput.isTriggered() && overHub) || Input.isTriggered("ok")) {
                        this.stopGauge(level, false);
                    } else if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
                        // 押す前ならキャンセルして選択へ戻れる(スタミナは減らない)
                        this._stage.visible = false;
                        this._phase = "select";
                        this._bgTarget = 0.4;
                        this._overlay.visible = true;
                        this._infoLine.visible = true;
                        this._infoKey = null;
                        this._back.visible = true;
                        this.setTitle("ホイールから だれが わざを だす?");
                        this._prevHit = -2;
                        SoundManager.playCancel();
                    } else if (this._gaugeAge > timeout) {
                        this.stopGauge(0, true);
                    }
                }
            }

            stopGauge(level, timeout) {
                this._phase = "result";
                this._resultAge = 0;
                this._level = level;
                this._rate = timeout ? WZ.minRate : wazaRateOf(level);
                this._perfect = !timeout && level >= 1 - WZ.perfectWidth;
                this._gauge.setLevel(level, true);
                this._gauge.flash();
                this._hub.burst();
                this._hub.setFocus(false);
                this._hub.setPress(false);
                this._hub._text = "";
                const bmp = this._resultSprite.bitmap;
                bmp.clear();
                let label, color;
                if (timeout) {
                    label = "TIME UP..."; color = "#c8c8d8";
                    SoundManager.playBuzzer();                       // 押していないので、ボタン音は鳴らさない
                } else {
                    wzPlaySe(WZ.seStop, () => SoundManager.playOk());   // 中央ボタンを押した効果音
                    if (this._perfect) {
                        label = "PERFECT!!"; color = "#ffe36a";
                        wzPlaySe(WZ.sePerfect, () => SoundManager.playEquip());
                    }
                    else if (level > 0.85) { label = "GREAT!"; color = "#9dff9d"; }
                    else if (level > 0.6) { label = "GOOD"; color = "#9fd8ff"; }
                    else if (level > 0.3) { label = "NICE"; color = "#ffffff"; }
                    else { label = "MISS..."; color = "#ffb0b0"; }
                }
                wzText(bmp, label, 0, 4, CFG.botW, this._perfect ? 30 : 24, "center", color, "rgba(20,10,50,0.95)");
                wzText(bmp, "ダメージ ×" + this._rate.toFixed(2), 0, 42, CFG.botW, 16, "center", "#ffffff");
            }

            updateResult() {
                this._resultAge++;
                const t = this._resultAge;
                this._resultSprite.opacity = Math.min(255, t * 40);
                const s = t < 8 ? 1.5 - 0.5 * (t / 8) : 1;
                this._resultSprite.scale.set(s);
                this._resultSprite.x = (1 - s) * CFG.botW / 2;
                if (t > 56) {
                    this._fire = true;
                    this.close();
                }
            }

            close() {
                this._closing = true;
            }

            finish() {
                if (this.parent) this.parent.removeChild(this);
                this._onClose(this._fire ? { actor: this._actor, skillId: this._skillInfo.skillId, rate: this._rate } : null);
            }
        }

        // 左上ボタン(index 0)で起動
        Scene_Battle.prototype.startWaza = function() {
            if (this._wazaUi || wazaBusy) return;
            const bad = BattleManager.isBattleEnd() || BattleManager._stageBusy || $gameMessage.isBusy() ||
                (this.isAnyInputWindowActive && this.isAnyInputWindowActive());
            if ($gameParty.battleMembers().length === 0 || bad) {
                SoundManager.playBuzzer();
                return;
            }
            wazaBusy = true;
            if (this._wheelButtons) this._wheelButtons.visible = false;   // ホイールは背景越しに見せる
            const ui = new Sprite_WazaUi(this, result => this.endWaza(result));
            ui.x = CFG.botX;
            ui.y = CFG.botY;
            this.addChildAt(ui, this.getChildIndex(this._bottomWindowLayer));
            this._wazaUi = ui;
        };

        Scene_Battle.prototype.endWaza = function(result) {
            this._wazaUi = null;
            wazaBusy = false;
            if (this._wheelButtons) this._wheelButtons.visible = true;
            if (!result) return;
            const actor = result.actor;
            if (!actor || !actor.isAlive() || !$gameParty.battleMembers().includes(actor)) return;
            // 強制行動(ランダム対象)。ダメージ倍率はこの行動にだけ付ける
            actor.forceAction(result.skillId, -1);
            const action = actor.currentAction();
            if (action) {
                action._wazaRate = result.rate;
                action._wazaAll = true;      // 残りスタミナを全消費
            }
            BattleManager.forceAction(actor);
        };

        // わざ中に戦闘シーンを抜けても、次の戦闘で時間が止まったままにならないようにする
        const _SB_terminate_waza = Scene_Battle.prototype.terminate;
        Scene_Battle.prototype.terminate = function() {
            wazaBusy = false;
            _SB_terminate_waza.apply(this, arguments);
        };

        if (WZ.enabled) {
            Scene_Battle.prototype.onWheelButton = function(index, label) {
                if (index === 0) this.startWaza();
            };
        }

        const _SB_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
        Scene_Battle.prototype.createDisplayObjects = function() {
            _SB_createDisplayObjects.call(this);
            this._wheel = new Sprite_BattleWheel();
            // 下画面の左上を原点にして配置(ウィンドウ層の下・下画面背景の上)
            this._wheel.x = CFG.botX;
            this._wheel.y = CFG.botY;
            this.addChildAt(this._wheel, this.getChildIndex(this._bottomWindowLayer));
            if (BTN_ENABLED) {
                this._wheelButtons = new Sprite_WheelButtons();
                this._wheelButtons.x = CFG.botX;
                this._wheelButtons.y = CFG.botY;
                this.addChildAt(this._wheelButtons, this.getChildIndex(this._bottomWindowLayer));
            }
        };

        const _SB_update = Scene_Battle.prototype.update;
        Scene_Battle.prototype.update = function() {
            _SB_update.call(this);
            if (this._statusWindow) this._statusWindow.visible = false;
        };

        //-------------------------------------------------------------------------
        // 敵の位置・大きさを上画面(400x240)に合わせる
        //-------------------------------------------------------------------------
        if (P.enemyFit !== "false") {
            const REF_W = Number(P.enemyRefWidth ?? 816);
            const REF_H = Number(P.enemyRefHeight ?? 624);
            const E_SCALE = Number(P.enemyScale ?? 0.5);
            const _SE_setBattler = Sprite_Enemy.prototype.setBattler;
            Sprite_Enemy.prototype.setBattler = function(battler) {
                _SE_setBattler.call(this, battler);
                if (battler) {
                    const box = Graphics.uiBox("top");
                    this.setHome(
                        Math.round(battler.screenX() * box.width / REF_W),
                        Math.round(battler.screenY() * box.height / REF_H)
                    );
                    this.scale.set(E_SCALE);
                }
            };
        }

        //-------------------------------------------------------------------------
        // 敵ごとの大きさ・位置の調整(構造体 / メモ欄 <敵サイズ:%> <敵X:px> <敵Y:px>)
        //-------------------------------------------------------------------------
        const ENEMY_SIZES = {};
        parseJson(P.enemySizes, []).forEach(str => {
            const d = parseJson(str, null);
            if (d && d.enemyId) ENEMY_SIZES[Number(d.enemyId)] = d;
        });
        const enemySizeOf = enemy => {
            const d = ENEMY_SIZES[enemy.enemyId()] || {};
            const meta = ($dataEnemies[enemy.enemyId()] || {}).meta || {};
            return {
                scale: Math.max(0.01, rsNum(d.scale ?? meta["敵サイズ"] ?? meta.EnemyScale, 100) / 100),
                ox: rsNum(d.offsetX ?? meta["敵X"] ?? meta.EnemyX, 0),
                oy: rsNum(d.offsetY ?? meta["敵Y"] ?? meta.EnemyY, 0)
            };
        };
        const _SE_setBattler_size = Sprite_Enemy.prototype.setBattler;
        Sprite_Enemy.prototype.setBattler = function(battler) {
            _SE_setBattler_size.call(this, battler);
            if (!battler) return;
            this._ds3dsEnemyBattler = battler;
            this._ds3dsEnemyBaseScaleX = this.scale.x;
            this._ds3dsEnemyBaseScaleY = this.scale.y;
            this._ds3dsEnemyBaseHomeX = this._homeX;
            this._ds3dsEnemyBaseHomeY = this._homeY;
            this.updateDs3dsEnemySize();
        };
        Sprite_Enemy.prototype.updateDs3dsEnemySize = function() {
            const battler = this._ds3dsEnemyBattler || this._enemy;
            if (!battler) return;
            const sz = enemySizeOf(battler);
            // 「敵ごとの大きさ」は、毎フレームの最終倍率として適用する。
            // RPG Maker側やステージ演出側がscaleを書き換えても、次の更新で確実に復元する。
            const baseX = Number(this._ds3dsEnemyBaseScaleX ?? 1) || 1;
            const baseY = Number(this._ds3dsEnemyBaseScaleY ?? 1) || 1;
            this.scale.set(baseX * sz.scale, baseY * sz.scale);
            const baseHomeX = Number(this._ds3dsEnemyBaseHomeX ?? this._homeX) || 0;
            const baseHomeY = Number(this._ds3dsEnemyBaseHomeY ?? this._homeY) || 0;
            let homeX = baseHomeX + sz.ox;
            let homeY = baseHomeY + sz.oy;

            // HPバーを立ち絵HUDの上端に固定する場合、敵の足元もそのバーを基準に配置する。
            if (EH.fixedToHud && this.parent) {
                const hud = this.parent._hud;
                if (hud) {
                    const targetHpY = hud._y0 + EH.hudOffsetY;
                    homeY = targetHpY + Number(prm.enemyBaseFromHpY ?? -8) + sz.oy;
                }
            }
            this.setHome(homeX, homeY);
        };

        // MZ標準処理や戦闘演出がscale/homeを更新した後にも、敵ごとの設定を維持する。
        const _SE_update_ds3ds = Sprite_Enemy.prototype.update;
        Sprite_Enemy.prototype.update = function() {
            _SE_update_ds3ds.call(this);
            if (this._ds3dsEnemyBattler) this.updateDs3dsEnemySize();
        };

        uiCategorize(Sprite_HudCard, "hud", ["drawPlate"]);
        uiCategorize(Sprite_WheelButton, "wheelButton", ["drawLabel"]);
    }
    if (prm.wheelEnabled !== "false") installBattleWheel();
})();
