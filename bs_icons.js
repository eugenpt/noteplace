//const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

// https://icons.getbootstrap.com/#icons
//  [].map.call(document.getElementsByClassName('name'),(dom)=>dom.innerHTML).join(' ')
bs_icon_list = [
"alarm alarm-fill align-bottom align-center align-end align-middle align-start align-top alt app"
,"app-indicator archive archive-fill arrow-90deg-down arrow-90deg-left arrow-90deg-right arrow-90deg-up arrow-bar-down arrow-bar-left arrow-bar-right"
,"arrow-bar-up arrow-clockwise arrow-counterclockwise arrow-down arrow-down-circle arrow-down-circle-fill arrow-down-left-circle arrow-down-left-circle-fill arrow-down-left-square arrow-down-left-square-fill"
,"arrow-down-right-circle arrow-down-right-circle-fill arrow-down-right-square arrow-down-right-square-fill arrow-down-square arrow-down-square-fill arrow-down-left arrow-down-right arrow-down-short arrow-down-up"
,"arrow-left arrow-left-circle arrow-left-circle-fill arrow-left-square arrow-left-square-fill arrow-left-right arrow-left-short arrow-repeat arrow-return-left arrow-return-right"
,"arrow-right arrow-right-circle arrow-right-circle-fill arrow-right-square arrow-right-square-fill arrow-right-short arrow-up arrow-up-circle arrow-up-circle-fill arrow-up-left-circle"
,"arrow-up-left-circle-fill arrow-up-left-square arrow-up-left-square-fill arrow-up-right-circle arrow-up-right-circle-fill arrow-up-right-square arrow-up-right-square-fill arrow-up-square arrow-up-square-fill arrow-up-left"
,"arrow-up-right arrow-up-short arrows-angle-contract arrows-angle-expand arrows-collapse arrows-expand arrows-fullscreen arrows-move aspect-ratio aspect-ratio-fill"
,"asterisk at award award-fill back backspace backspace-fill backspace-reverse backspace-reverse-fill badge-3d"
,"badge-3d-fill badge-4k badge-4k-fill badge-8k badge-8k-fill badge-ad badge-ad-fill badge-ar badge-ar-fill badge-cc"
,"badge-cc-fill badge-hd badge-hd-fill badge-tm badge-tm-fill badge-vo badge-vo-fill badge-vr badge-vr-fill badge-wc"
,"badge-wc-fill bag bag-check bag-check-fill bag-dash bag-dash-fill bag-fill bag-plus bag-plus-fill bag-x"
,"bag-x-fill bar-chart bar-chart-fill bar-chart-line bar-chart-line-fill bar-chart-steps basket basket-fill basket2 basket2-fill"
,"basket3 basket3-fill battery battery-charging battery-full battery-half bell bell-fill bezier bezier2"
,"bicycle binoculars binoculars-fill blockquote-left blockquote-right book book-fill book-half bookmark bookmark-check"
,"bookmark-check-fill bookmark-dash bookmark-dash-fill bookmark-fill bookmark-heart bookmark-heart-fill bookmark-plus bookmark-plus-fill bookmark-star bookmark-star-fill"
,"bookmark-x bookmark-x-fill bookmarks bookmarks-fill bookshelf bootstrap bootstrap-fill bootstrap-reboot border border-all"
,"border-bottom border-center border-inner border-left border-middle border-outer border-right border-style border-top border-width"
,"bounding-box bounding-box-circles box box-arrow-down-left box-arrow-down-right box-arrow-down box-arrow-in-down box-arrow-in-down-left box-arrow-in-down-right box-arrow-in-left"
,"box-arrow-in-right box-arrow-in-up box-arrow-in-up-left box-arrow-in-up-right box-arrow-left box-arrow-right box-arrow-up box-arrow-up-left box-arrow-up-right box-seam"
,"braces bricks briefcase briefcase-fill brightness-alt-high brightness-alt-high-fill brightness-alt-low brightness-alt-low-fill brightness-high brightness-high-fill"
,"brightness-low brightness-low-fill broadcast broadcast-pin brush brush-fill bucket bucket-fill bug bug-fill"
,"building bullseye calculator calculator-fill calendar calendar-check calendar-check-fill calendar-date calendar-date-fill calendar-day"
,"calendar-day-fill calendar-event calendar-event-fill calendar-fill calendar-minus calendar-minus-fill calendar-month calendar-month-fill calendar-plus calendar-plus-fill"
,"calendar-range calendar-range-fill calendar-week calendar-week-fill calendar-x calendar-x-fill calendar2 calendar2-check calendar2-check-fill calendar2-date"
,"calendar2-date-fill calendar2-day calendar2-day-fill calendar2-event calendar2-event-fill calendar2-fill calendar2-minus calendar2-minus-fill calendar2-month calendar2-month-fill"
,"calendar2-plus calendar2-plus-fill calendar2-range calendar2-range-fill calendar2-week calendar2-week-fill calendar2-x calendar2-x-fill calendar3 calendar3-event"
,"calendar3-event-fill calendar3-fill calendar3-range calendar3-range-fill calendar3-week calendar3-week-fill calendar4 calendar4-event calendar4-range calendar4-week"
,"camera camera2 camera-fill camera-reels camera-reels-fill camera-video camera-video-fill camera-video-off camera-video-off-fill capslock"
,"capslock-fill card-checklist card-heading card-image card-list card-text caret-down caret-down-fill caret-down-square caret-down-square-fill"
,"caret-left caret-left-fill caret-left-square caret-left-square-fill caret-right caret-right-fill caret-right-square caret-right-square-fill caret-up caret-up-fill"
,"caret-up-square caret-up-square-fill cart cart-check cart-check-fill cart-dash cart-dash-fill cart-fill cart-plus cart-plus-fill"
,"cart-x cart-x-fill cart2 cart3 cart4 cash cash-stack cast chat chat-dots"
,"chat-dots-fill chat-fill chat-left chat-left-dots chat-left-dots-fill chat-left-fill chat-left-quote chat-left-quote-fill chat-left-text chat-left-text-fill"
,"chat-quote chat-quote-fill chat-right chat-right-dots chat-right-dots-fill chat-right-fill chat-right-quote chat-right-quote-fill chat-right-text chat-right-text-fill"
,"chat-square chat-square-dots chat-square-dots-fill chat-square-fill chat-square-quote chat-square-quote-fill chat-square-text chat-square-text-fill chat-text chat-text-fill"
,"check check-all check-circle check-circle-fill check-square check-square-fill check2 check2-all check2-circle check2-square"
,"chevron-bar-contract chevron-bar-down chevron-bar-expand chevron-bar-left chevron-bar-right chevron-bar-up chevron-compact-down chevron-compact-left chevron-compact-right chevron-compact-up"
,"chevron-contract chevron-double-down chevron-double-left chevron-double-right chevron-double-up chevron-down chevron-expand chevron-left chevron-right chevron-up"
,"circle circle-fill circle-half slash-circle circle-square clipboard clipboard-check clipboard-data clipboard-minus clipboard-plus"
,"clipboard-x clock clock-fill clock-history cloud cloud-arrow-down cloud-arrow-down-fill cloud-arrow-up cloud-arrow-up-fill cloud-check"
,"cloud-check-fill cloud-download cloud-download-fill cloud-drizzle cloud-drizzle-fill cloud-fill cloud-fog cloud-fog-fill cloud-fog2 cloud-fog2-fill"
,"cloud-hail cloud-hail-fill cloud-haze cloud-haze-1 cloud-haze-fill cloud-haze2-fill cloud-lightning cloud-lightning-fill cloud-lightning-rain cloud-lightning-rain-fill"
,"cloud-minus cloud-minus-fill cloud-moon cloud-moon-fill cloud-plus cloud-plus-fill cloud-rain cloud-rain-fill cloud-rain-heavy cloud-rain-heavy-fill"
,"cloud-slash cloud-slash-fill cloud-sleet cloud-sleet-fill cloud-snow cloud-snow-fill cloud-sun cloud-sun-fill cloud-upload cloud-upload-fill"
,"clouds clouds-fill cloudy cloudy-fill code code-slash code-square collection collection-fill collection-play"
,"collection-play-fill columns columns-gap command compass compass-fill cone cone-striped controller cpu"
,"cpu-fill credit-card credit-card-2-back credit-card-2-back-fill credit-card-2-front credit-card-2-front-fill credit-card-fill crop cup cup-fill"
,"cup-straw cursor cursor-fill cursor-text dash dash-circle dash-circle-dotted dash-circle-fill dash-square dash-square-dotted"
,"dash-square-fill diagram-2 diagram-2-fill diagram-3 diagram-3-fill diamond diamond-fill diamond-half dice-1 dice-1-fill"
,"dice-2 dice-2-fill dice-3 dice-3-fill dice-4 dice-4-fill dice-5 dice-5-fill dice-6 dice-6-fill"
,"disc disc-fill discord display display-fill distribute-horizontal distribute-vertical door-closed door-closed-fill door-open"
,"door-open-fill dot download droplet droplet-fill droplet-half earbuds easel easel-fill egg"
,"egg-fill egg-fried eject eject-fill emoji-angry emoji-angry-fill emoji-dizzy emoji-dizzy-fill emoji-expressionless emoji-expressionless-fill"
,"emoji-frown emoji-frown-fill emoji-heart-eyes emoji-heart-eyes-fill emoji-laughing emoji-laughing-fill emoji-neutral emoji-neutral-fill emoji-smile emoji-smile-fill"
,"emoji-smile-upside-down emoji-smile-upside-down-fill emoji-sunglasses emoji-sunglasses-fill emoji-wink emoji-wink-fill envelope envelope-fill envelope-open envelope-open-fill"
,"eraser eraser-fill exclamation exclamation-circle exclamation-circle-fill exclamation-diamond exclamation-diamond-fill exclamation-octagon exclamation-octagon-fill exclamation-square"
,"exclamation-square-fill exclamation-triangle exclamation-triangle-fill exclude eye eye-fill eye-slash eye-slash-fill eyedropper eyeglasses"
,"facebook file file-arrow-down file-arrow-down-fill file-arrow-up file-arrow-up-fill file-bar-graph file-bar-graph-fill file-binary file-binary-fill"
,"file-break file-break-fill file-check file-check-fill file-code file-code-fill file-diff file-diff-fill file-earmark file-earmark-arrow-down"
,"file-earmark-arrow-down-fill file-earmark-arrow-up file-earmark-arrow-up-fill file-earmark-bar-graph file-earmark-bar-graph-fill file-earmark-binary file-earmark-binary-fill file-earmark-break file-earmark-break-fill file-earmark-check"
,"file-earmark-check-fill file-earmark-code file-earmark-code-fill file-earmark-diff file-earmark-diff-fill file-earmark-easel file-earmark-easel-fill file-earmark-excel file-earmark-excel-fill file-earmark-fill"
,"file-earmark-font file-earmark-font-fill file-earmark-image file-earmark-image-fill file-earmark-lock file-earmark-lock-fill file-earmark-lock2 file-earmark-lock2-fill file-earmark-medical file-earmark-medical-fill"
,"file-earmark-minus file-earmark-minus-fill file-earmark-music file-earmark-music-fill file-earmark-person file-earmark-person-fill file-earmark-play file-earmark-play-fill file-earmark-plus file-earmark-plus-fill"
,"file-earmark-post file-earmark-post-fill file-earmark-ppt file-earmark-ppt-fill file-earmark-richtext file-earmark-richtext-fill file-earmark-ruled file-earmark-ruled-fill file-earmark-slides file-earmark-slides-fill"
,"file-earmark-spreadsheet file-earmark-spreadsheet-fill file-earmark-text file-earmark-text-fill file-earmark-word file-earmark-word-fill file-earmark-x file-earmark-x-fill file-earmark-zip file-earmark-zip-fill"
,"file-easel file-easel-fill file-excel file-excel-fill file-fill file-font file-font-fill file-image file-image-fill file-lock"
,"file-lock-fill file-lock2 file-lock2-fill file-medical file-medical-fill file-minus file-minus-fill file-music file-music-fill file-person"
,"file-person-fill file-play file-play-fill file-plus file-plus-fill file-post file-post-fill file-ppt file-ppt-fill file-richtext"
,"file-richtext-fill file-ruled file-ruled-fill file-slides file-slides-fill file-spreadsheet file-spreadsheet-fill file-text file-text-fill file-word"
,"file-word-fill file-x file-x-fill file-zip file-zip-fill files files-alt film filter filter-circle"
,"filter-circle-fill filter-left filter-right filter-square filter-square-fill flag flag-fill flower1 flower2 flower3"
,"folder folder-check folder-fill folder-minus folder-plus folder-symlink folder-symlink-fill folder-x folder2 folder2-open"
,"fonts forward forward-fill front fullscreen fullscreen-exit funnel funnel-fill gear gear-fill"
,"gear-wide gear-wide-connected gem geo geo-alt geo-alt-fill geo-fill gift gift-fill github"
,"globe globe2 google graph-down graph-up grid grid-1x2 grid-1x2-fill grid-3x2 grid-3x2-gap"
,"grid-3x2-gap-fill grid-3x3 grid-3x3-gap grid-3x3-gap-fill grid-fill grip-horizontal grip-vertical hammer hand-index hand-index-fill"
,"hand-index-thumb hand-index-thumb-fill hand-thumbs-down hand-thumbs-down-fill hand-thumbs-up hand-thumbs-up-fill handbag handbag-fill hash hdd"
,"hdd-fill hdd-network hdd-network-fill hdd-rack hdd-rack-fill hdd-stack hdd-stack-fill headphones headset heart"
,"heart-fill heart-half heptagon heptagon-fill heptagon-half hexagon hexagon-fill hexagon-half hourglass hourglass-bottom"
,"hourglass-split hourglass-top house house-door house-door-fill house-fill hr hurricane image image-alt"
,"image-fill images inbox inbox-fill inboxes-fill inboxes info info-circle info-circle-fill info-square"
,"info-square-fill input-cursor input-cursor-text instagram intersect journal journal-album journal-arrow-down journal-arrow-up journal-bookmark"
,"journal-bookmark-fill journal-check journal-code journal-medical journal-minus journal-plus journal-richtext journal-text journal-x journals"
,"joystick justify justify-left justify-right kanban kanban-fill key key-fill keyboard keyboard-fill"
,"ladder lamp lamp-fill laptop laptop-fill layer-backward layer-forward layers layers-fill layers-half"
,"layout-sidebar layout-sidebar-inset-reverse layout-sidebar-inset layout-sidebar-reverse layout-split layout-text-sidebar layout-text-sidebar-reverse layout-text-window layout-text-window-reverse layout-three-columns"
,"layout-wtf life-preserver lightbulb lightbulb-fill lightbulb-off lightbulb-off-fill lightning lightning-charge lightning-charge-fill lightning-fill"
,"link link-45deg linkedin list list-check list-nested list-ol list-stars list-task list-ul"
,"lock lock-fill mailbox mailbox2 map map-fill markdown markdown-fill mask megaphone"
,"megaphone-fill menu-app menu-app-fill menu-button menu-button-fill menu-button-wide menu-button-wide-fill menu-down menu-up mic"
,"mic-fill mic-mute mic-mute-fill minecart minecart-loaded moisture moon moon-fill moon-stars moon-stars-fill"
,"mouse mouse-fill mouse2 mouse2-fill mouse3 mouse3-fill music-note music-note-beamed music-note-list music-player"
,"music-player-fill newspaper node-minus node-minus-fill node-plus node-plus-fill nut nut-fill octagon octagon-fill"
,"octagon-half option outlet paint-bucket palette palette-fill palette2 paperclip paragraph patch-check"
,"patch-check-fill patch-exclamation patch-exclamation-fill patch-minus patch-minus-fill patch-plus patch-plus-fill patch-question patch-question-fill pause"
,"pause-btn pause-btn-fill pause-circle pause-circle-fill pause-fill peace peace-fill pen pen-fill pencil"
,"pencil-fill pencil-square pentagon pentagon-fill pentagon-half people person-circle people-fill percent person"
,"person-badge person-badge-fill person-bounding-box person-check person-check-fill person-dash person-dash-fill person-fill person-lines-fill person-plus"
,"person-plus-fill person-square person-x person-x-fill phone phone-fill phone-landscape phone-landscape-fill phone-vibrate phone-vibrate-fill"
,"pie-chart pie-chart-fill pin pin-angle pin-angle-fill pin-fill pip pip-fill play play-btn"
,"play-btn-fill play-circle play-circle-fill play-fill plug plug-fill plus plus-circle plus-circle-dotted plus-circle-fill"
,"plus-square plus-square-dotted plus-square-fill power printer printer-fill puzzle puzzle-fill question question-circle"
,"question-diamond question-diamond-fill question-circle-fill question-octagon question-octagon-fill question-square question-square-fill rainbow receipt receipt-cutoff"
,"reception-0 reception-1 reception-2 reception-3 reception-4 record record-btn record-btn-fill record-circle record-circle-fill"
,"record-fill record2 record2-fill reply reply-all reply-all-fill reply-fill rss rss-fill rulers"
,"save save-fill save2 save2-fill scissors screwdriver search segmented-nav server share"
,"share-fill shield shield-check shield-exclamation shield-fill shield-fill-check shield-fill-exclamation shield-fill-minus shield-fill-plus shield-fill-x"
,"shield-lock shield-lock-fill shield-minus shield-plus shield-shaded shield-slash shield-slash-fill shield-x shift shift-fill"
,"shop shop-window shuffle signpost signpost-2 signpost-2-fill signpost-fill signpost-split signpost-split-fill sim"
,"sim-fill skip-backward skip-backward-btn skip-backward-btn-fill skip-backward-circle skip-backward-circle-fill skip-backward-fill skip-end skip-end-btn skip-end-btn-fill"
,"skip-end-circle skip-end-circle-fill skip-end-fill skip-forward skip-forward-btn skip-forward-btn-fill skip-forward-circle skip-forward-circle-fill skip-forward-fill skip-start"
,"skip-start-btn skip-start-btn-fill skip-start-circle skip-start-circle-fill skip-start-fill slack slash slash-circle-fill slash-square slash-square-fill"
,"sliders smartwatch snow snow2 snow3 sort-alpha-down sort-alpha-down-alt sort-alpha-up sort-alpha-up-alt sort-down"
,"sort-down-alt sort-numeric-down sort-numeric-down-alt sort-numeric-up sort-numeric-up-alt sort-up sort-up-alt soundwave speaker speaker-fill"
,"speedometer speedometer2 spellcheck square square-fill square-half stack star star-fill star-half"
,"stars stickies stickies-fill sticky sticky-fill stop stop-btn stop-btn-fill stop-circle stop-circle-fill"
,"stop-fill stoplights stoplights-fill stopwatch stopwatch-fill subtract suit-club suit-club-fill suit-diamond suit-diamond-fill"
,"suit-heart suit-heart-fill suit-spade suit-spade-fill sun sun-fill sunglasses sunrise sunrise-fill sunset"
,"sunset-fill symmetry-horizontal symmetry-vertical table tablet tablet-fill tablet-landscape tablet-landscape-fill tag tag-fill"
,"tags tags-fill telegram telephone telephone-fill telephone-forward telephone-forward-fill telephone-inbound telephone-inbound-fill telephone-minus"
,"telephone-minus-fill telephone-outbound telephone-outbound-fill telephone-plus telephone-plus-fill telephone-x telephone-x-fill terminal terminal-fill text-center"
,"text-indent-left text-indent-right text-left text-paragraph text-right textarea textarea-resize textarea-t thermometer thermometer-half"
,"thermometer-high thermometer-low thermometer-snow thermometer-sun three-dots three-dots-vertical toggle-off toggle-on toggle2-off toggle2-on"
,"toggles toggles2 tools tornado trash trash-fill trash2 trash2-fill tree tree-fill"
,"triangle triangle-fill triangle-half trophy trophy-fill tropical-storm truck truck-flatbed tsunami tv"
,"tv-fill twitch twitter type type-bold type-h1 type-h2 type-h3 type-italic type-strikethrough"
,"type-underline ui-checks ui-checks-grid ui-radios ui-radios-grid umbrella umbrella-fill union unlock unlock-fill"
,"upc upc-scan upload vector-pen view-list view-stacked vinyl vinyl-fill voicemail volume-down"
,"volume-down-fill volume-mute volume-mute-fill volume-off volume-off-fill volume-up volume-up-fill vr wallet wallet-fill"
,"wallet2 watch water whatsapp wifi wifi-1 wifi-2 wifi-off wind window"
,"window-dock window-sidebar wrench x x-circle x-circle-fill x-diamond x-diamond-fill x-octagon x-octagon-fill"
,"x-square x-square-fill youtube zoom-in zoom-out"
];

bs_icon_list = bs_icon_list.join(' ').split(' ');

//https://unicode.org/emoji/charts/full-emoji-list.html
// [].map.call(document.getElementsByClassName('name'),(dom)=>dom.parentElement.getElementsByTagName('td')[2].innerHTML).join(' ')
emojis = "😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺ 😚 😙 🥲 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😶‍🌫️ 😏 😒 🙄 😬 😮‍💨 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 😵‍💫 🤯 🤠 🥳 🥸 😎 🤓 🧐 😕 😟 🙁 ☹ 😮 😯 😲 😳 🥺 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠ 💩 🤡 👹 👺 👻 👽 👾 🤖 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🙈 🙉 🙊 💋 💌 💘 💝 💖 💗 💓 💞 💕 💟 ❣ 💔 ❤️‍🔥 ❤️‍🩹 ❤ 🧡 💛 💚 💙 💜 🤎 🖤 🤍 💯 💢 💥 💫 💦 💨 🕳 💣 💬 👁️‍🗨️ 🗨 🗯 💭 💤 👋 🤚 🖐 ✋ 🖖 👌 🤌 🤏 ✌ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻 👃 🧠 🫀 🫁 🦷 🦴 👀 👁 👅 👄 👶 🧒 👦 👧 🧑 👱 👨 🧔 🧔‍♂️ 🧔‍♀️ 👨‍🦰 👨‍🦱 👨‍🦳 👨‍🦲 👩 👩‍🦰 🧑‍🦰 👩‍🦱 🧑‍🦱 👩‍🦳 🧑‍🦳 👩‍🦲 🧑‍🦲 👱‍♀️ 👱‍♂️ 🧓 👴 👵 🙍 🙍‍♂️ 🙍‍♀️ 🙎 🙎‍♂️ 🙎‍♀️ 🙅 🙅‍♂️ 🙅‍♀️ 🙆 🙆‍♂️ 🙆‍♀️ 💁 💁‍♂️ 💁‍♀️ 🙋 🙋‍♂️ 🙋‍♀️ 🧏 🧏‍♂️ 🧏‍♀️ 🙇 🙇‍♂️ 🙇‍♀️ 🤦 🤦‍♂️ 🤦‍♀️ 🤷 🤷‍♂️ 🤷‍♀️ 🧑‍⚕️ 👨‍⚕️ 👩‍⚕️ 🧑‍🎓 👨‍🎓 👩‍🎓 🧑‍🏫 👨‍🏫 👩‍🏫 🧑‍⚖️ 👨‍⚖️ 👩‍⚖️ 🧑‍🌾 👨‍🌾 👩‍🌾 🧑‍🍳 👨‍🍳 👩‍🍳 🧑‍🔧 👨‍🔧 👩‍🔧 🧑‍🏭 👨‍🏭 👩‍🏭 🧑‍💼 👨‍💼 👩‍💼 🧑‍🔬 👨‍🔬 👩‍🔬 🧑‍💻 👨‍💻 👩‍💻 🧑‍🎤 👨‍🎤 👩‍🎤 🧑‍🎨 👨‍🎨 👩‍🎨 🧑‍✈️ 👨‍✈️ 👩‍✈️ 🧑‍🚀 👨‍🚀 👩‍🚀 🧑‍🚒 👨‍🚒 👩‍🚒 👮 👮‍♂️ 👮‍♀️ 🕵 🕵️‍♂️ 🕵️‍♀️ 💂 💂‍♂️ 💂‍♀️ 🥷 👷 👷‍♂️ 👷‍♀️ 🤴 👸 👳 👳‍♂️ 👳‍♀️ 👲 🧕 🤵 🤵‍♂️ 🤵‍♀️ 👰 👰‍♂️ 👰‍♀️ 🤰 🤱 👩‍🍼 👨‍🍼 🧑‍🍼 👼 🎅 🤶 🧑‍🎄 🦸 🦸‍♂️ 🦸‍♀️ 🦹 🦹‍♂️ 🦹‍♀️ 🧙 🧙‍♂️ 🧙‍♀️ 🧚 🧚‍♂️ 🧚‍♀️ 🧛 🧛‍♂️ 🧛‍♀️ 🧜 🧜‍♂️ 🧜‍♀️ 🧝 🧝‍♂️ 🧝‍♀️ 🧞 🧞‍♂️ 🧞‍♀️ 🧟 🧟‍♂️ 🧟‍♀️ 💆 💆‍♂️ 💆‍♀️ 💇 💇‍♂️ 💇‍♀️ 🚶 🚶‍♂️ 🚶‍♀️ 🧍 🧍‍♂️ 🧍‍♀️ 🧎 🧎‍♂️ 🧎‍♀️ 🧑‍🦯 👨‍🦯 👩‍🦯 🧑‍🦼 👨‍🦼 👩‍🦼 🧑‍🦽 👨‍🦽 👩‍🦽 🏃 🏃‍♂️ 🏃‍♀️ 💃 🕺 🕴 👯 👯‍♂️ 👯‍♀️ 🧖 🧖‍♂️ 🧖‍♀️ 🧗 🧗‍♂️ 🧗‍♀️ 🤺 🏇 ⛷ 🏂 🏌 🏌️‍♂️ 🏌️‍♀️ 🏄 🏄‍♂️ 🏄‍♀️ 🚣 🚣‍♂️ 🚣‍♀️ 🏊 🏊‍♂️ 🏊‍♀️ ⛹ ⛹️‍♂️ ⛹️‍♀️ 🏋 🏋️‍♂️ 🏋️‍♀️ 🚴 🚴‍♂️ 🚴‍♀️ 🚵 🚵‍♂️ 🚵‍♀️ 🤸 🤸‍♂️ 🤸‍♀️ 🤼 🤼‍♂️ 🤼‍♀️ 🤽 🤽‍♂️ 🤽‍♀️ 🤾 🤾‍♂️ 🤾‍♀️ 🤹 🤹‍♂️ 🤹‍♀️ 🧘 🧘‍♂️ 🧘‍♀️ 🛀 🛌 🧑‍🤝‍🧑 👭 👫 👬 💏 👩‍❤️‍💋‍👨 👨‍❤️‍💋‍👨 👩‍❤️‍💋‍👩 💑 👩‍❤️‍👨 👨‍❤️‍👨 👩‍❤️‍👩 👪 👨‍👩‍👦 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 👨‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👦 👨‍👦‍👦 👨‍👧 👨‍👧‍👦 👨‍👧‍👧 👩‍👦 👩‍👦‍👦 👩‍👧 👩‍👧‍👦 👩‍👧‍👧 🗣 👤 👥 🫂 👣 🦰 🦱 🦳 🦲 🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🐈‍⬛ 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🦬 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒 🐘 🦣 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿 🦫 🦔 🦇 🐻 🐻‍❄️ 🐨 🐼 🦥 🦦 🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🕊 🦅 🦆 🦢 🦉 🦤 🪶 🦩 🦚 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙 🐚 🐌 🦋 🐛 🐜 🐝 🪲 🐞 🦗 🪳 🕷 🕸 🦂 🦟 🪰 🪱 🦠 💐 🌸 💮 🏵 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🪴 🌲 🌳 🌴 🌵 🌾 🌿 ☘ 🍀 🍁 🍂 🍃 🍇 🍈 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍏 🍐 🍑 🍒 🍓 🫐 🥝 🍅 🫒 🥥 🥑 🍆 🥔 🥕 🌽 🌶 🫑 🥒 🥬 🥦 🧄 🧅 🍄 🥜 🌰 🍞 🥐 🥖 🫓 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🫔 🥙 🧆 🥚 🍳 🥘 🍲 🫕 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🫖 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🧋 🧃 🧉 🧊 🥢 🍽 🍴 🥄 🔪 🏺 🌍 🌎 🌏 🌐 🗺 🗾 🧭 🏔 ⛰ 🌋 🗻 🏕 🏖 🏜 🏝 🏞 🏟 🏛 🏗 🧱 🪨 🪵 🛖 🏘 🏚 🏠 🏡 🏢 🏣 🏤 🏥 🏦 🏨 🏩 🏪 🏫 🏬 🏭 🏯 🏰 💒 🗼 🗽 ⛪ 🕌 🛕 🕍 ⛩ 🕋 ⛲ ⛺ 🌁 🌃 🏙 🌄 🌅 🌆 🌇 🌉 ♨ 🎠 🎡 🎢 💈 🎪 🚂 🚃 🚄 🚅 🚆 🚇 🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🛻 🚚 🚛 🚜 🏎 🏍 🛵 🦽 🦼 🛺 🚲 🛴 🛹 🛼 🚏 🛣 🛤 🛢 ⛽ 🚨 🚥 🚦 🛑 🚧 ⚓ ⛵ 🛶 🚤 🛳 ⛴ 🛥 🚢 ✈ 🛩 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🛰 🚀 🛸 🛎 🧳 ⌛ ⏳ ⌚ ⏰ ⏱ ⏲ 🕰 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 🌡 ☀ 🌝 🌞 🪐 ⭐ 🌟 🌠 🌌 ☁ ⛅ ⛈ 🌤 🌥 🌦 🌧 🌨 🌩 🌪 🌫 🌬 🌀 🌈 🌂 ☂ ☔ ⛱ ⚡ ❄ ☃ ⛄ ☄ 🔥 💧 🌊 🎃 🎄 🎆 🎇 🧨 ✨ 🎈 🎉 🎊 🎋 🎍 🎎 🎏 🎐 🎑 🧧 🎀 🎁 🎗 🎟 🎫 🎖 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🪄 🧿 🎮 🕹 🎰 🎲 🧩 🧸 🪅 🪆 ♠ ♥ ♦ ♣ ♟ 🃏 🀄 🎴 🎭 🖼 🎨 🧵 🪡 🧶 🪢 👓 🕶 🥽 🥼 🦺 👔 👕 👖 🧣 🧤 🧥 🧦 👗 👘 🥻 🩱 🩲 🩳 👙 👚 👛 👜 👝 🛍 🎒 🩴 👞 👟 🥾 🥿 👠 👡 🩰 👢 👑 👒 🎩 🎓 🧢 🪖 ⛑ 📿 💄 💍 💎 🔇 🔈 🔉 🔊 📢 📣 📯 🔔 🔕 🎼 🎵 🎶 🎙 🎚 🎛 🎤 🎧 📻 🎷 🪗 🎸 🎹 🎺 🎻 🪕 🥁 🪘 📱 📲 ☎ 📞 📟 📠 🔋 🔌 💻 🖥 🖨 ⌨ 🖱 🖲 💽 💾 💿 📀 🧮 🎥 🎞 📽 🎬 📺 📷 📸 📹 📼 🔍 🔎 🕯 💡 🔦 🏮 🪔 📔 📕 📖 📗 📘 📙 📚 📓 📒 📃 📜 📄 📰 🗞 📑 🔖 🏷 💰 🪙 💴 💵 💶 💷 💸 💳 🧾 💹 ✉ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳 ✏ ✒ 🖋 🖊 🖌 🖍 📝 💼 📁 📂 🗂 📅 📆 🗒 🗓 📇 📈 📉 📊 📋 📌 📍 📎 🖇 📏 📐 ✂ 🗃 🗄 🗑 🔒 🔓 🔏 🔐 🔑 🗝 🔨 🪓 ⛏ ⚒ 🛠 🗡 ⚔ 🔫 🪃 🏹 🛡 🪚 🔧 🪛 🔩 ⚙ 🗜 ⚖ 🦯 🔗 ⛓ 🪝 🧰 🧲 🪜 ⚗ 🧪 🧫 🧬 🔬 🔭 📡 💉 🩸 💊 🩹 🩺 🚪 🛗 🪞 🪟 🛏 🛋 🪑 🚽 🪠 🚿 🛁 🪤 🪒 🧴 🧷 🧹 🧺 🧻 🪣 🧼 🪥 🧽 🧯 🛒 🚬 ⚰ 🪦 ⚱ 🗿 🪧 🏧 🚮 🚰 ♿ 🚹 🚺 🚻 🚼 🚾 🛂 🛃 🛄 🛅 ⚠ 🚸 ⛔ 🚫 🚳 🚭 🚯 🚱 🚷 📵 🔞 ☢ ☣ ⬆ ↗ ➡ ↘ ⬇ ↙ ⬅ ↖ ↕ ↔ ↩ ↪ ⤴ ⤵ 🔃 🔄 🔙 🔚 🔛 🔜 🔝 🛐 ⚛ 🕉 ✡ ☸ ☯ ✝ ☦ ☪ ☮ 🕎 🔯 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⛎ 🔀 🔁 🔂 ▶ ⏩ ⏭ ⏯ ◀ ⏪ ⏮ 🔼 ⏫ 🔽 ⏬ ⏸ ⏹ ⏺ ⏏ 🎦 🔅 🔆 📶 📳 📴 ♀ ♂ ⚧ ✖ ➕ ➖ ➗ ♾ ‼ ⁉ ❓ ❔ ❕ ❗ 〰 💱 💲 ⚕ ♻ ⚜ 🔱 📛 🔰 ⭕ ✅ ☑ ✔ ❌ ❎ ➰ ➿ 〽 ✳ ✴ ❇ © ® ™ #️⃣ *️⃣ 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔠 🔡 🔢 🔣 🔤 🅰 🆎 🅱 🆑 🆒 🆓 ℹ 🆔 Ⓜ 🆕 🆖 🅾 🆗 🅿 🆘 🆙 🆚 🈁 🈂 🈷 🈶 🈯 🉐 🈹 🈚 🈲 🉑 🈸 🈴 🈳 ㊗ ㊙ 🈺 🈵 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜ ◼ ◻ ◾ ◽ ▪ ▫ 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲 🏁 🚩 🎌 🏴 🏳 🏳️‍🌈 🏳️‍⚧️ 🏴‍☠️ 🇦🇨 🇦🇩 🇦🇪 🇦🇫 🇦🇬 🇦🇮 🇦🇱 🇦🇲 🇦🇴 🇦🇶 🇦🇷 🇦🇸 🇦🇹 🇦🇺 🇦🇼 🇦🇽 🇦🇿 🇧🇦 🇧🇧 🇧🇩 🇧🇪 🇧🇫 🇧🇬 🇧🇭 🇧🇮 🇧🇯 🇧🇱 🇧🇲 🇧🇳 🇧🇴 🇧🇶 🇧🇷 🇧🇸 🇧🇹 🇧🇻 🇧🇼 🇧🇾 🇧🇿 🇨🇦 🇨🇨 🇨🇩 🇨🇫 🇨🇬 🇨🇭 🇨🇮 🇨🇰 🇨🇱 🇨🇲 🇨🇳 🇨🇴 🇨🇵 🇨🇷 🇨🇺 🇨🇻 🇨🇼 🇨🇽 🇨🇾 🇨🇿 🇩🇪 🇩🇬 🇩🇯 🇩🇰 🇩🇲 🇩🇴 🇩🇿 🇪🇦 🇪🇨 🇪🇪 🇪🇬 🇪🇭 🇪🇷 🇪🇸 🇪🇹 🇪🇺 🇫🇮 🇫🇯 🇫🇰 🇫🇲 🇫🇴 🇫🇷 🇬🇦 🇬🇧 🇬🇩 🇬🇪 🇬🇫 🇬🇬 🇬🇭 🇬🇮 🇬🇱 🇬🇲 🇬🇳 🇬🇵 🇬🇶 🇬🇷 🇬🇸 🇬🇹 🇬🇺 🇬🇼 🇬🇾 🇭🇰 🇭🇲 🇭🇳 🇭🇷 🇭🇹 🇭🇺 🇮🇨 🇮🇩 🇮🇪 🇮🇱 🇮🇲 🇮🇳 🇮🇴 🇮🇶 🇮🇷 🇮🇸 🇮🇹 🇯🇪 🇯🇲 🇯🇴 🇯🇵 🇰🇪 🇰🇬 🇰🇭 🇰🇮 🇰🇲 🇰🇳 🇰🇵 🇰🇷 🇰🇼 🇰🇾 🇰🇿 🇱🇦 🇱🇧 🇱🇨 🇱🇮 🇱🇰 🇱🇷 🇱🇸 🇱🇹 🇱🇺 🇱🇻 🇱🇾 🇲🇦 🇲🇨 🇲🇩 🇲🇪 🇲🇫 🇲🇬 🇲🇭 🇲🇰 🇲🇱 🇲🇲 🇲🇳 🇲🇴 🇲🇵 🇲🇶 🇲🇷 🇲🇸 🇲🇹 🇲🇺 🇲🇻 🇲🇼 🇲🇽 🇲🇾 🇲🇿 🇳🇦 🇳🇨 🇳🇪 🇳🇫 🇳🇬 🇳🇮 🇳🇱 🇳🇴 🇳🇵 🇳🇷 🇳🇺 🇳🇿 🇴🇲 🇵🇦 🇵🇪 🇵🇫 🇵🇬 🇵🇭 🇵🇰 🇵🇱 🇵🇲 🇵🇳 🇵🇷 🇵🇸 🇵🇹 🇵🇼 🇵🇾 🇶🇦 🇷🇪 🇷🇴 🇷🇸 🇷🇺 🇷🇼 🇸🇦 🇸🇧 🇸🇨 🇸🇩 🇸🇪 🇸🇬 🇸🇭 🇸🇮 🇸🇯 🇸🇰 🇸🇱 🇸🇲 🇸🇳 🇸🇴 🇸🇷 🇸🇸 🇸🇹 🇸🇻 🇸🇽 🇸🇾 🇸🇿 🇹🇦 🇹🇨 🇹🇩 🇹🇫 🇹🇬 🇹🇭 🇹🇯 🇹🇰 🇹🇱 🇹🇲 🇹🇳 🇹🇴 🇹🇷 🇹🇹 🇹🇻 🇹🇼 🇹🇿 🇺🇦 🇺🇬 🇺🇲 🇺🇳 🇺🇸 🇺🇾 🇺🇿 🇻🇦 🇻🇨 🇻🇪 🇻🇬 🇻🇮 🇻🇳 🇻🇺 🇼🇫 🇼🇸 🇽🇰 🇾🇪 🇾🇹 🇿🇦 🇿🇲 🇿🇼 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🏴󠁧󠁢󠁳󠁣󠁴󠁿 🏴󠁧󠁢󠁷󠁬󠁳󠁿".split(' ')
//[].map.call(document.getElementsByClassName('name'),(dom)=>dom.innerHTML);
emoji_codes=[
  "grinning face|grinning face with big eyes|grinning face with smiling eyes|beaming face with smiling eyes|grinning squinting face|grinning face with sweat|rolling on the floor laughing|face with tears of joy|slightly smiling face|upside-down face"
, "winking face|smiling face with smiling eyes|smiling face with halo|smiling face with hearts|smiling face with heart-eyes|star-struck|face blowing a kiss|kissing face|smiling face|kissing face with closed eyes"
, "kissing face with smiling eyes|smiling face with tear|face savoring food|face with tongue|winking face with tongue|zany face|squinting face with tongue|money-mouth face|hugging face|face with hand over mouth"
, "shushing face|thinking face|zipper-mouth face|face with raised eyebrow|neutral face|expressionless face|face without mouth|⊛ face in clouds|smirking face|unamused face"
, "face with rolling eyes|grimacing face|⊛ face exhaling|lying face|relieved face|pensive face|sleepy face|drooling face|sleeping face|face with medical mask"
, "face with thermometer|face with head-bandage|nauseated face|face vomiting|sneezing face|hot face|cold face|woozy face|knocked-out face|⊛ face with spiral eyes"
, "exploding head|cowboy hat face|partying face|disguised face|smiling face with sunglasses|nerd face|face with monocle|confused face|worried face|slightly frowning face"
, "frowning face|face with open mouth|hushed face|astonished face|flushed face|pleading face|frowning face with open mouth|anguished face|fearful face|anxious face with sweat"
, "sad but relieved face|crying face|loudly crying face|face screaming in fear|confounded face|persevering face|disappointed face|downcast face with sweat|weary face|tired face"
, "yawning face|face with steam from nose|pouting face|angry face|face with symbols on mouth|smiling face with horns|angry face with horns|skull|skull and crossbones|pile of poo"
, "clown face|ogre|goblin|ghost|alien|alien monster|robot|grinning cat|grinning cat with smiling eyes|cat with tears of joy"
, "smiling cat with heart-eyes|cat with wry smile|kissing cat|weary cat|crying cat|pouting cat|see-no-evil monkey|hear-no-evil monkey|speak-no-evil monkey|kiss mark"
, "love letter|heart with arrow|heart with ribbon|sparkling heart|growing heart|beating heart|revolving hearts|two hearts|heart decoration|heart exclamation"
, "broken heart|⊛ heart on fire|⊛ mending heart|red heart|orange heart|yellow heart|green heart|blue heart|purple heart|brown heart"
, "black heart|white heart|hundred points|anger symbol|collision|dizzy|sweat droplets|dashing away|hole|bomb"
, "speech balloon|eye in speech bubble|left speech bubble|right anger bubble|thought balloon|zzz|waving hand|raised back of hand|hand with fingers splayed|raised hand"
, "vulcan salute|OK hand|pinched fingers|pinching hand|victory hand|crossed fingers|love-you gesture|sign of the horns|call me hand|backhand index pointing left"
, "backhand index pointing right|backhand index pointing up|middle finger|backhand index pointing down|index pointing up|thumbs up|thumbs down|raised fist|oncoming fist|left-facing fist"
, "right-facing fist|clapping hands|raising hands|open hands|palms up together|handshake|folded hands|writing hand|nail polish|selfie"
, "flexed biceps|mechanical arm|mechanical leg|leg|foot|ear|ear with hearing aid|nose|brain|anatomical heart"
, "lungs|tooth|bone|eyes|eye|tongue|mouth|baby|child|boy"
, "girl|person|person: blond hair|man|person: beard|⊛ man: beard|⊛ woman: beard|man: red hair|man: curly hair|man: white hair"
, "man: bald|woman|woman: red hair|person: red hair|woman: curly hair|person: curly hair|woman: white hair|person: white hair|woman: bald|person: bald"
, "woman: blond hair|man: blond hair|older person|old man|old woman|person frowning|man frowning|woman frowning|person pouting|man pouting"
, "woman pouting|person gesturing NO|man gesturing NO|woman gesturing NO|person gesturing OK|man gesturing OK|woman gesturing OK|person tipping hand|man tipping hand|woman tipping hand"
, "person raising hand|man raising hand|woman raising hand|deaf person|deaf man|deaf woman|person bowing|man bowing|woman bowing|person facepalming"
, "man facepalming|woman facepalming|person shrugging|man shrugging|woman shrugging|health worker|man health worker|woman health worker|student|man student"
, "woman student|teacher|man teacher|woman teacher|judge|man judge|woman judge|farmer|man farmer|woman farmer"
, "cook|man cook|woman cook|mechanic|man mechanic|woman mechanic|factory worker|man factory worker|woman factory worker|office worker"
, "man office worker|woman office worker|scientist|man scientist|woman scientist|technologist|man technologist|woman technologist|singer|man singer"
, "woman singer|artist|man artist|woman artist|pilot|man pilot|woman pilot|astronaut|man astronaut|woman astronaut"
, "firefighter|man firefighter|woman firefighter|police officer|man police officer|woman police officer|detective|man detective|woman detective|guard"
, "man guard|woman guard|ninja|construction worker|man construction worker|woman construction worker|prince|princess|person wearing turban|man wearing turban"
, "woman wearing turban|person with skullcap|woman with headscarf|person in tuxedo|man in tuxedo|woman in tuxedo|person with veil|man with veil|woman with veil|pregnant woman"
, "breast-feeding|woman feeding baby|man feeding baby|person feeding baby|baby angel|Santa Claus|Mrs. Claus|mx claus|superhero|man superhero"
, "woman superhero|supervillain|man supervillain|woman supervillain|mage|man mage|woman mage|fairy|man fairy|woman fairy"
, "vampire|man vampire|woman vampire|merperson|merman|mermaid|elf|man elf|woman elf|genie"
, "man genie|woman genie|zombie|man zombie|woman zombie|person getting massage|man getting massage|woman getting massage|person getting haircut|man getting haircut"
, "woman getting haircut|person walking|man walking|woman walking|person standing|man standing|woman standing|person kneeling|man kneeling|woman kneeling"
, "person with white cane|man with white cane|woman with white cane|person in motorized wheelchair|man in motorized wheelchair|woman in motorized wheelchair|person in manual wheelchair|man in manual wheelchair|woman in manual wheelchair|person running"
, "man running|woman running|woman dancing|man dancing|person in suit levitating|people with bunny ears|men with bunny ears|women with bunny ears|person in steamy room|man in steamy room"
, "woman in steamy room|person climbing|man climbing|woman climbing|person fencing|horse racing|skier|snowboarder|person golfing|man golfing"
, "woman golfing|person surfing|man surfing|woman surfing|person rowing boat|man rowing boat|woman rowing boat|person swimming|man swimming|woman swimming"
, "person bouncing ball|man bouncing ball|woman bouncing ball|person lifting weights|man lifting weights|woman lifting weights|person biking|man biking|woman biking|person mountain biking"
, "man mountain biking|woman mountain biking|person cartwheeling|man cartwheeling|woman cartwheeling|people wrestling|men wrestling|women wrestling|person playing water polo|man playing water polo"
, "woman playing water polo|person playing handball|man playing handball|woman playing handball|person juggling|man juggling|woman juggling|person in lotus position|man in lotus position|woman in lotus position"
, "person taking bath|person in bed|people holding hands|women holding hands|woman and man holding hands|men holding hands|kiss|kiss: woman, man|kiss: man, man|kiss: woman, woman"
, "couple with heart|couple with heart: woman, man|couple with heart: man, man|couple with heart: woman, woman|family|family: man, woman, boy|family: man, woman, girl|family: man, woman, girl, boy|family: man, woman, boy, boy|family: man, woman, girl, girl"
, "family: man, man, boy|family: man, man, girl|family: man, man, girl, boy|family: man, man, boy, boy|family: man, man, girl, girl|family: woman, woman, boy|family: woman, woman, girl|family: woman, woman, girl, boy|family: woman, woman, boy, boy|family: woman, woman, girl, girl"
, "family: man, boy|family: man, boy, boy|family: man, girl|family: man, girl, boy|family: man, girl, girl|family: woman, boy|family: woman, boy, boy|family: woman, girl|family: woman, girl, boy|family: woman, girl, girl"
, "speaking head|bust in silhouette|busts in silhouette|people hugging|footprints|red hair|curly hair|white hair|bald|monkey face"
, "monkey|gorilla|orangutan|dog face|dog|guide dog|service dog|poodle|wolf|fox"
, "raccoon|cat face|cat|black cat|lion|tiger face|tiger|leopard|horse face|horse"
, "unicorn|zebra|deer|bison|cow face|ox|water buffalo|cow|pig face|pig"
, "boar|pig nose|ram|ewe|goat|camel|two-hump camel|llama|giraffe|elephant"
, "mammoth|rhinoceros|hippopotamus|mouse face|mouse|rat|hamster|rabbit face|rabbit|chipmunk"
, "beaver|hedgehog|bat|bear|polar bear|koala|panda|sloth|otter|skunk"
, "kangaroo|badger|paw prints|turkey|chicken|rooster|hatching chick|baby chick|front-facing baby chick|bird"
, "penguin|dove|eagle|duck|swan|owl|dodo|feather|flamingo|peacock"
, "parrot|frog|crocodile|turtle|lizard|snake|dragon face|dragon|sauropod|T-Rex"
, "spouting whale|whale|dolphin|seal|fish|tropical fish|blowfish|shark|octopus|spiral shell"
, "snail|butterfly|bug|ant|honeybee|beetle|lady beetle|cricket|cockroach|spider"
, "spider web|scorpion|mosquito|fly|worm|microbe|bouquet|cherry blossom|white flower|rosette"
, "rose|wilted flower|hibiscus|sunflower|blossom|tulip|seedling|potted plant|evergreen tree|deciduous tree"
, "palm tree|cactus|sheaf of rice|herb|shamrock|four leaf clover|maple leaf|fallen leaf|leaf fluttering in wind|grapes"
, "melon|watermelon|tangerine|lemon|banana|pineapple|mango|red apple|green apple|pear"
, "peach|cherries|strawberry|blueberries|kiwi fruit|tomato|olive|coconut|avocado|eggplant"
, "potato|carrot|ear of corn|hot pepper|bell pepper|cucumber|leafy green|broccoli|garlic|onion"
, "mushroom|peanuts|chestnut|bread|croissant|baguette bread|flatbread|pretzel|bagel|pancakes"
, "waffle|cheese wedge|meat on bone|poultry leg|cut of meat|bacon|hamburger|french fries|pizza|hot dog"
, "sandwich|taco|burrito|tamale|stuffed flatbread|falafel|egg|cooking|shallow pan of food|pot of food"
, "fondue|bowl with spoon|green salad|popcorn|butter|salt|canned food|bento box|rice cracker|rice ball"
, "cooked rice|curry rice|steaming bowl|spaghetti|roasted sweet potato|oden|sushi|fried shrimp|fish cake with swirl|moon cake"
, "dango|dumpling|fortune cookie|takeout box|crab|lobster|shrimp|squid|oyster|soft ice cream"
, "shaved ice|ice cream|doughnut|cookie|birthday cake|shortcake|cupcake|pie|chocolate bar|candy"
, "lollipop|custard|honey pot|baby bottle|glass of milk|hot beverage|teapot|teacup without handle|sake|bottle with popping cork"
, "wine glass|cocktail glass|tropical drink|beer mug|clinking beer mugs|clinking glasses|tumbler glass|cup with straw|bubble tea|beverage box"
, "mate|ice|chopsticks|fork and knife with plate|fork and knife|spoon|kitchen knife|amphora|globe showing Europe-Africa|globe showing Americas"
, "globe showing Asia-Australia|globe with meridians|world map|map of Japan|compass|snow-capped mountain|mountain|volcano|mount fuji|camping"
, "beach with umbrella|desert|desert island|national park|stadium|classical building|building construction|brick|rock|wood"
, "hut|houses|derelict house|house|house with garden|office building|Japanese post office|post office|hospital|bank"
, "hotel|love hotel|convenience store|school|department store|factory|Japanese castle|castle|wedding|Tokyo tower"
, "Statue of Liberty|church|mosque|hindu temple|synagogue|shinto shrine|kaaba|fountain|tent|foggy"
, "night with stars|cityscape|sunrise over mountains|sunrise|cityscape at dusk|sunset|bridge at night|hot springs|carousel horse|ferris wheel"
, "roller coaster|barber pole|circus tent|locomotive|railway car|high-speed train|bullet train|train|metro|light rail"
, "station|tram|monorail|mountain railway|tram car|bus|oncoming bus|trolleybus|minibus|ambulance"
, "fire engine|police car|oncoming police car|taxi|oncoming taxi|automobile|oncoming automobile|sport utility vehicle|pickup truck|delivery truck"
, "articulated lorry|tractor|racing car|motorcycle|motor scooter|manual wheelchair|motorized wheelchair|auto rickshaw|bicycle|kick scooter"
, "skateboard|roller skate|bus stop|motorway|railway track|oil drum|fuel pump|police car light|horizontal traffic light|vertical traffic light"
, "stop sign|construction|anchor|sailboat|canoe|speedboat|passenger ship|ferry|motor boat|ship"
, "airplane|small airplane|airplane departure|airplane arrival|parachute|seat|helicopter|suspension railway|mountain cableway|aerial tramway"
, "satellite|rocket|flying saucer|bellhop bell|luggage|hourglass done|hourglass not done|watch|alarm clock|stopwatch"
, "timer clock|mantelpiece clock|twelve o’clock|twelve-thirty|one o’clock|one-thirty|two o’clock|two-thirty|three o’clock|three-thirty"
, "four o’clock|four-thirty|five o’clock|five-thirty|six o’clock|six-thirty|seven o’clock|seven-thirty|eight o’clock|eight-thirty"
, "nine o’clock|nine-thirty|ten o’clock|ten-thirty|eleven o’clock|eleven-thirty|new moon|waxing crescent moon|first quarter moon|waxing gibbous moon"
, "full moon|waning gibbous moon|last quarter moon|waning crescent moon|crescent moon|new moon face|first quarter moon face|last quarter moon face|thermometer|sun"
, "full moon face|sun with face|ringed planet|star|glowing star|shooting star|milky way|cloud|sun behind cloud|cloud with lightning and rain"
, "sun behind small cloud|sun behind large cloud|sun behind rain cloud|cloud with rain|cloud with snow|cloud with lightning|tornado|fog|wind face|cyclone"
, "rainbow|closed umbrella|umbrella|umbrella with rain drops|umbrella on ground|high voltage|snowflake|snowman|snowman without snow|comet"
, "fire|droplet|water wave|jack-o-lantern|Christmas tree|fireworks|sparkler|firecracker|sparkles|balloon"
, "party popper|confetti ball|tanabata tree|pine decoration|Japanese dolls|carp streamer|wind chime|moon viewing ceremony|red envelope|ribbon"
, "wrapped gift|reminder ribbon|admission tickets|ticket|military medal|trophy|sports medal|1st place medal|2nd place medal|3rd place medal"
, "soccer ball|baseball|softball|basketball|volleyball|american football|rugby football|tennis|flying disc|bowling"
, "cricket game|field hockey|ice hockey|lacrosse|ping pong|badminton|boxing glove|martial arts uniform|goal net|flag in hole"
, "ice skate|fishing pole|diving mask|running shirt|skis|sled|curling stone|bullseye|yo-yo|kite"
, "pool 8 ball|crystal ball|magic wand|nazar amulet|video game|joystick|slot machine|game die|puzzle piece|teddy bear"
, "piñata|nesting dolls|spade suit|heart suit|diamond suit|club suit|chess pawn|joker|mahjong red dragon|flower playing cards"
, "performing arts|framed picture|artist palette|thread|sewing needle|yarn|knot|glasses|sunglasses|goggles"
, "lab coat|safety vest|necktie|t-shirt|jeans|scarf|gloves|coat|socks|dress"
, "kimono|sari|one-piece swimsuit|briefs|shorts|bikini|woman’s clothes|purse|handbag|clutch bag"
, "shopping bags|backpack|thong sandal|man’s shoe|running shoe|hiking boot|flat shoe|high-heeled shoe|woman’s sandal|ballet shoes"
, "woman’s boot|crown|woman’s hat|top hat|graduation cap|billed cap|military helmet|rescue worker’s helmet|prayer beads|lipstick"
, "ring|gem stone|muted speaker|speaker low volume|speaker medium volume|speaker high volume|loudspeaker|megaphone|postal horn|bell"
, "bell with slash|musical score|musical note|musical notes|studio microphone|level slider|control knobs|microphone|headphone|radio"
, "saxophone|accordion|guitar|musical keyboard|trumpet|violin|banjo|drum|long drum|mobile phone"
, "mobile phone with arrow|telephone|telephone receiver|pager|fax machine|battery|electric plug|laptop|desktop computer|printer"
, "keyboard|computer mouse|trackball|computer disk|floppy disk|optical disk|dvd|abacus|movie camera|film frames"
, "film projector|clapper board|television|camera|camera with flash|video camera|videocassette|magnifying glass tilted left|magnifying glass tilted right|candle"
, "light bulb|flashlight|red paper lantern|diya lamp|notebook with decorative cover|closed book|open book|green book|blue book|orange book"
, "books|notebook|ledger|page with curl|scroll|page facing up|newspaper|rolled-up newspaper|bookmark tabs|bookmark"
, "label|money bag|coin|yen banknote|dollar banknote|euro banknote|pound banknote|money with wings|credit card|receipt"
, "chart increasing with yen|envelope|e-mail|incoming envelope|envelope with arrow|outbox tray|inbox tray|package|closed mailbox with raised flag|closed mailbox with lowered flag"
, "open mailbox with raised flag|open mailbox with lowered flag|postbox|ballot box with ballot|pencil|black nib|fountain pen|pen|paintbrush|crayon"
, "memo|briefcase|file folder|open file folder|card index dividers|calendar|tear-off calendar|spiral notepad|spiral calendar|card index"
, "chart increasing|chart decreasing|bar chart|clipboard|pushpin|round pushpin|paperclip|linked paperclips|straight ruler|triangular ruler"
, "scissors|card file box|file cabinet|wastebasket|locked|unlocked|locked with pen|locked with key|key|old key"
, "hammer|axe|pick|hammer and pick|hammer and wrench|dagger|crossed swords|water pistol|boomerang|bow and arrow"
, "shield|carpentry saw|wrench|screwdriver|nut and bolt|gear|clamp|balance scale|white cane|link"
, "chains|hook|toolbox|magnet|ladder|alembic|test tube|petri dish|dna|microscope"
, "telescope|satellite antenna|syringe|drop of blood|pill|adhesive bandage|stethoscope|door|elevator|mirror"
, "window|bed|couch and lamp|chair|toilet|plunger|shower|bathtub|mouse trap|razor"
, "lotion bottle|safety pin|broom|basket|roll of paper|bucket|soap|toothbrush|sponge|fire extinguisher"
, "shopping cart|cigarette|coffin|headstone|funeral urn|moai|placard|ATM sign|litter in bin sign|potable water"
, "wheelchair symbol|men’s room|women’s room|restroom|baby symbol|water closet|passport control|customs|baggage claim|left luggage"
, "warning|children crossing|no entry|prohibited|no bicycles|no smoking|no littering|non-potable water|no pedestrians|no mobile phones"
, "no one under eighteen|radioactive|biohazard|up arrow|up-right arrow|right arrow|down-right arrow|down arrow|down-left arrow|left arrow"
, "up-left arrow|up-down arrow|left-right arrow|right arrow curving left|left arrow curving right|right arrow curving up|right arrow curving down|clockwise vertical arrows|counterclockwise arrows button|BACK arrow"
, "END arrow|ON! arrow|SOON arrow|TOP arrow|place of worship|atom symbol|om|star of David|wheel of dharma|yin yang"
, "latin cross|orthodox cross|star and crescent|peace symbol|menorah|dotted six-pointed star|Aries|Taurus|Gemini|Cancer"
, "Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|Ophiuchus|shuffle tracks button"
, "repeat button|repeat single button|play button|fast-forward button|next track button|play or pause button|reverse button|fast reverse button|last track button|upwards button"
, "fast up button|downwards button|fast down button|pause button|stop button|record button|eject button|cinema|dim button|bright button"
, "antenna bars|vibration mode|mobile phone off|female sign|male sign|transgender symbol|multiply|plus|minus|divide"
, "infinity|double exclamation mark|exclamation question mark|red question mark|white question mark|white exclamation mark|red exclamation mark|wavy dash|currency exchange|heavy dollar sign"
, "medical symbol|recycling symbol|fleur-de-lis|trident emblem|name badge|Japanese symbol for beginner|hollow red circle|check mark button|check box with check|check mark"
, "cross mark|cross mark button|curly loop|double curly loop|part alternation mark|eight-spoked asterisk|eight-pointed star|sparkle|copyright|registered"
, "trade mark|keycap: #|keycap: *|keycap: 0|keycap: 1|keycap: 2|keycap: 3|keycap: 4|keycap: 5|keycap: 6"
, "keycap: 7|keycap: 8|keycap: 9|keycap: 10|input latin uppercase|input latin lowercase|input numbers|input symbols|input latin letters|A button (blood type)"
, "AB button (blood type)|B button (blood type)|CL button|COOL button|FREE button|information|ID button|circled M|NEW button|NG button"
, "O button (blood type)|OK button|P button|SOS button|UP! button|VS button|Japanese “here” button|Japanese “service charge” button|Japanese “monthly amount” button|Japanese “not free of charge” button"
, "Japanese “reserved” button|Japanese “bargain” button|Japanese “discount” button|Japanese “free of charge” button|Japanese “prohibited” button|Japanese “acceptable” button|Japanese “application” button|Japanese “passing grade” button|Japanese “vacancy” button|Japanese “congratulations” button"
, "Japanese “secret” button|Japanese “open for business” button|Japanese “no vacancy” button|red circle|orange circle|yellow circle|green circle|blue circle|purple circle|brown circle"
, "black circle|white circle|red square|orange square|yellow square|green square|blue square|purple square|brown square|black large square"
, "white large square|black medium square|white medium square|black medium-small square|white medium-small square|black small square|white small square|large orange diamond|large blue diamond|small orange diamond"
, "small blue diamond|red triangle pointed up|red triangle pointed down|diamond with a dot|radio button|white square button|black square button|chequered flag|triangular flag|crossed flags"
, "black flag|white flag|rainbow flag|transgender flag|pirate flag|flag: Ascension Island|flag: Andorra|flag: United Arab Emirates|flag: Afghanistan|flag: Antigua &amp; Barbuda"
, "flag: Anguilla|flag: Albania|flag: Armenia|flag: Angola|flag: Antarctica|flag: Argentina|flag: American Samoa|flag: Austria|flag: Australia|flag: Aruba"
, "flag: Åland Islands|flag: Azerbaijan|flag: Bosnia &amp; Herzegovina|flag: Barbados|flag: Bangladesh|flag: Belgium|flag: Burkina Faso|flag: Bulgaria|flag: Bahrain|flag: Burundi"
, "flag: Benin|flag: St. Barthélemy|flag: Bermuda|flag: Brunei|flag: Bolivia|flag: Caribbean Netherlands|flag: Brazil|flag: Bahamas|flag: Bhutan|flag: Bouvet Island"
, "flag: Botswana|flag: Belarus|flag: Belize|flag: Canada|flag: Cocos (Keeling) Islands|flag: Congo - Kinshasa|flag: Central African Republic|flag: Congo - Brazzaville|flag: Switzerland|flag: Côte d’Ivoire"
, "flag: Cook Islands|flag: Chile|flag: Cameroon|flag: China|flag: Colombia|flag: Clipperton Island|flag: Costa Rica|flag: Cuba|flag: Cape Verde|flag: Curaçao"
, "flag: Christmas Island|flag: Cyprus|flag: Czechia|flag: Germany|flag: Diego Garcia|flag: Djibouti|flag: Denmark|flag: Dominica|flag: Dominican Republic|flag: Algeria"
, "flag: Ceuta &amp; Melilla|flag: Ecuador|flag: Estonia|flag: Egypt|flag: Western Sahara|flag: Eritrea|flag: Spain|flag: Ethiopia|flag: European Union|flag: Finland"
, "flag: Fiji|flag: Falkland Islands|flag: Micronesia|flag: Faroe Islands|flag: France|flag: Gabon|flag: United Kingdom|flag: Grenada|flag: Georgia|flag: French Guiana"
, "flag: Guernsey|flag: Ghana|flag: Gibraltar|flag: Greenland|flag: Gambia|flag: Guinea|flag: Guadeloupe|flag: Equatorial Guinea|flag: Greece|flag: South Georgia &amp; South Sandwich Islands"
, "flag: Guatemala|flag: Guam|flag: Guinea-Bissau|flag: Guyana|flag: Hong Kong SAR China|flag: Heard &amp; McDonald Islands|flag: Honduras|flag: Croatia|flag: Haiti|flag: Hungary"
, "flag: Canary Islands|flag: Indonesia|flag: Ireland|flag: Israel|flag: Isle of Man|flag: India|flag: British Indian Ocean Territory|flag: Iraq|flag: Iran|flag: Iceland"
, "flag: Italy|flag: Jersey|flag: Jamaica|flag: Jordan|flag: Japan|flag: Kenya|flag: Kyrgyzstan|flag: Cambodia|flag: Kiribati|flag: Comoros"
, "flag: St. Kitts &amp; Nevis|flag: North Korea|flag: South Korea|flag: Kuwait|flag: Cayman Islands|flag: Kazakhstan|flag: Laos|flag: Lebanon|flag: St. Lucia|flag: Liechtenstein"
, "flag: Sri Lanka|flag: Liberia|flag: Lesotho|flag: Lithuania|flag: Luxembourg|flag: Latvia|flag: Libya|flag: Morocco|flag: Monaco|flag: Moldova"
, "flag: Montenegro|flag: St. Martin|flag: Madagascar|flag: Marshall Islands|flag: North Macedonia|flag: Mali|flag: Myanmar (Burma)|flag: Mongolia|flag: Macao SAR China|flag: Northern Mariana Islands"
, "flag: Martinique|flag: Mauritania|flag: Montserrat|flag: Malta|flag: Mauritius|flag: Maldives|flag: Malawi|flag: Mexico|flag: Malaysia|flag: Mozambique"
, "flag: Namibia|flag: New Caledonia|flag: Niger|flag: Norfolk Island|flag: Nigeria|flag: Nicaragua|flag: Netherlands|flag: Norway|flag: Nepal|flag: Nauru"
, "flag: Niue|flag: New Zealand|flag: Oman|flag: Panama|flag: Peru|flag: French Polynesia|flag: Papua New Guinea|flag: Philippines|flag: Pakistan|flag: Poland"
, "flag: St. Pierre &amp; Miquelon|flag: Pitcairn Islands|flag: Puerto Rico|flag: Palestinian Territories|flag: Portugal|flag: Palau|flag: Paraguay|flag: Qatar|flag: Réunion|flag: Romania"
, "flag: Serbia|flag: Russia|flag: Rwanda|flag: Saudi Arabia|flag: Solomon Islands|flag: Seychelles|flag: Sudan|flag: Sweden|flag: Singapore|flag: St. Helena"
, "flag: Slovenia|flag: Svalbard &amp; Jan Mayen|flag: Slovakia|flag: Sierra Leone|flag: San Marino|flag: Senegal|flag: Somalia|flag: Suriname|flag: South Sudan|flag: São Tomé &amp; Príncipe"
, "flag: El Salvador|flag: Sint Maarten|flag: Syria|flag: Eswatini|flag: Tristan da Cunha|flag: Turks &amp; Caicos Islands|flag: Chad|flag: French Southern Territories|flag: Togo|flag: Thailand"
, "flag: Tajikistan|flag: Tokelau|flag: Timor-Leste|flag: Turkmenistan|flag: Tunisia|flag: Tonga|flag: Turkey|flag: Trinidad &amp; Tobago|flag: Tuvalu|flag: Taiwan"
, "flag: Tanzania|flag: Ukraine|flag: Uganda|flag: U.S. Outlying Islands|flag: United Nations|flag: United States|flag: Uruguay|flag: Uzbekistan|flag: Vatican City|flag: St. Vincent &amp; Grenadines"
, "flag: Venezuela|flag: British Virgin Islands|flag: U.S. Virgin Islands|flag: Vietnam|flag: Vanuatu|flag: Wallis &amp; Futuna|flag: Samoa|flag: Kosovo|flag: Yemen|flag: Mayotte"
, "flag: South Africa|flag: Zambia|flag: Zimbabwe|flag: England|flag: Scotland|flag: Wales"
        
].join('|').split('|');

// https://fontawesome.com/cheatsheet
// array_chunks([].map.call(document.getElementsByClassName('ma0 pa0 pr2 select-all word-wrap dtc v-top tl f2 icon-name'),s=>s.innerHTML),20).map(s=>s.join(' '))
//  or rather
// https://fontawesome.com/icons?d=gallery&p=9&m=free
// array_chunks ([].map.call(document.getElementsByClassName('db gray5 hover-gray7 text select-all'),s=>s.innerHTML),20).map(s=>s.join(' '))
fa_icon_list = [
  "500px accessible-icon accusoft acquisitions-incorporated ad address-book address-book address-card address-card adjust adn adversal affiliatetheme air-freshener airbnb algolia align-center align-justify align-left align-right"
, "alipay allergies amazon amazon-pay ambulance american-sign-language-interpreting amilia anchor android angellist angle-double-down angle-double-left angle-double-right angle-double-up angle-down angle-left angle-right angle-up angry angry"
, "angrycreative angular ankh app-store app-store-ios apper apple apple-alt apple-pay archive archway arrow-alt-circle-down arrow-alt-circle-down arrow-alt-circle-left arrow-alt-circle-left arrow-alt-circle-right arrow-alt-circle-right arrow-alt-circle-up arrow-alt-circle-up arrow-circle-down"
, "arrow-circle-left arrow-circle-right arrow-circle-up arrow-down arrow-left arrow-right arrow-up arrows-alt arrows-alt-h arrows-alt-v artstation assistive-listening-systems asterisk asymmetrik at atlas atlassian atom audible audio-description"
, "autoprefixer avianex aviato award aws baby baby-carriage backspace backward bacon bacteria bacterium bahai balance-scale balance-scale-left balance-scale-right ban band-aid bandcamp barcode"
, "bars baseball-ball basketball-ball bath battery-empty battery-full battery-half battery-quarter battery-three-quarters battle-net bed beer behance behance-square bell bell bell-slash bell-slash bezier-curve bible"
, "bicycle biking bimobject binoculars biohazard birthday-cake bitbucket bitcoin bity black-tie blackberry blender blender-phone blind blog blogger blogger-b bluetooth bluetooth-b bold"
, "bolt bomb bone bong book book-dead book-medical book-open book-reader bookmark bookmark bootstrap border-all border-none border-style bowling-ball box box-open box-tissue boxes"
, "braille brain bread-slice briefcase briefcase-medical broadcast-tower broom brush btc buffer bug building building bullhorn bullseye burn buromobelexperte bus bus-alt business-time"
, "buy-n-large buysellads calculator calendar calendar calendar-alt calendar-alt calendar-check calendar-check calendar-day calendar-minus calendar-minus calendar-plus calendar-plus calendar-times calendar-times calendar-week camera camera-retro campground"
, "canadian-maple-leaf candy-cane cannabis capsules car car-alt car-battery car-crash car-side caravan caret-down caret-left caret-right caret-square-down caret-square-down caret-square-left caret-square-left caret-square-right caret-square-right caret-square-up"
, "caret-square-up caret-up carrot cart-arrow-down cart-plus cash-register cat cc-amazon-pay cc-amex cc-apple-pay cc-diners-club cc-discover cc-jcb cc-mastercard cc-paypal cc-stripe cc-visa centercode centos certificate"
, "chair chalkboard chalkboard-teacher charging-station chart-area chart-bar chart-bar chart-line chart-pie check check-circle check-circle check-double check-square check-square cheese chess chess-bishop chess-board chess-king"
, "chess-knight chess-pawn chess-queen chess-rook chevron-circle-down chevron-circle-left chevron-circle-right chevron-circle-up chevron-down chevron-left chevron-right chevron-up child chrome chromecast church circle circle circle-notch city"
, "clinic-medical clipboard clipboard clipboard-check clipboard-list clock clock clone clone closed-captioning closed-captioning cloud cloud-download-alt cloud-meatball cloud-moon cloud-moon-rain cloud-rain cloud-showers-heavy cloud-sun cloud-sun-rain"
, "cloud-upload-alt cloudflare cloudscale cloudsmith cloudversify cocktail code code-branch codepen codiepie coffee cog cogs coins columns comment comment comment-alt comment-alt comment-dollar"
, "comment-dots comment-dots comment-medical comment-slash comments comments comments-dollar compact-disc compass compass compress compress-alt compress-arrows-alt concierge-bell confluence connectdevelop contao cookie cookie-bite copy"
, "copy copyright copyright cotton-bureau couch cpanel creative-commons creative-commons-by creative-commons-nc creative-commons-nc-eu creative-commons-nc-jp creative-commons-nd creative-commons-pd creative-commons-pd-alt creative-commons-remix creative-commons-sa creative-commons-sampling creative-commons-sampling-plus creative-commons-share creative-commons-zero"
, "credit-card credit-card critical-role crop crop-alt cross crosshairs crow crown crutch css3 css3-alt cube cubes cut cuttlefish d-and-d d-and-d-beyond dailymotion dashcube"
, "database deaf deezer delicious democrat deploydog deskpro desktop dev deviantart dharmachakra dhl diagnoses diaspora dice dice-d20 dice-d6 dice-five dice-four dice-one"
, "dice-six dice-three dice-two digg digital-ocean digital-tachograph directions discord discourse disease divide dizzy dizzy dna dochub docker dog dollar-sign dolly dolly-flatbed"
, "donate door-closed door-open dot-circle dot-circle dove download draft2digital drafting-compass dragon draw-polygon dribbble dribbble-square dropbox drum drum-steelpan drumstick-bite drupal dumbbell dumpster"
, "dumpster-fire dungeon dyalog earlybirds ebay edge edge-legacy edit edit egg eject elementor ellipsis-h ellipsis-v ello ember empire envelope envelope envelope-open"
, "envelope-open envelope-open-text envelope-square envira equals eraser erlang ethereum ethernet etsy euro-sign evernote exchange-alt exclamation exclamation-circle exclamation-triangle expand expand-alt expand-arrows-alt expeditedssl"
, "external-link-alt external-link-square-alt eye eye eye-dropper eye-slash eye-slash facebook facebook-f facebook-messenger facebook-square fan fantasy-flight-games fast-backward fast-forward faucet fax feather feather-alt fedex"
, "fedora female fighter-jet figma file file file-alt file-alt file-archive file-archive file-audio file-audio file-code file-code file-contract file-csv file-download file-excel file-excel file-export"
, "file-image file-image file-import file-invoice file-invoice-dollar file-medical file-medical-alt file-pdf file-pdf file-powerpoint file-powerpoint file-prescription file-signature file-upload file-video file-video file-word file-word fill fill-drip"
, "film filter fingerprint fire fire-alt fire-extinguisher firefox firefox-browser first-aid first-order first-order-alt firstdraft fish fist-raised flag flag flag-checkered flag-usa flask flickr"
, "flipboard flushed flushed fly folder folder folder-minus folder-open folder-open folder-plus font font-awesome font-awesome-alt font-awesome-flag fonticons fonticons-fi football-ball fort-awesome fort-awesome-alt forumbee"
, "forward foursquare free-code-camp freebsd frog frown frown frown-open frown-open fulcrum funnel-dollar futbol futbol galactic-republic galactic-senate gamepad gas-pump gavel gem gem"
, "genderless get-pocket gg gg-circle ghost gift gifts git git-alt git-square github github-alt github-square gitkraken gitlab gitter glass-cheers glass-martini glass-martini-alt glass-whiskey"
, "glasses glide glide-g globe globe-africa globe-americas globe-asia globe-europe gofore golf-ball goodreads goodreads-g google google-drive google-pay google-play google-plus google-plus-g google-plus-square google-wallet"
, "gopuram graduation-cap gratipay grav greater-than greater-than-equal grimace grimace grin grin grin-alt grin-alt grin-beam grin-beam grin-beam-sweat grin-beam-sweat grin-hearts grin-hearts grin-squint grin-squint"
, "grin-squint-tears grin-squint-tears grin-stars grin-stars grin-tears grin-tears grin-tongue grin-tongue grin-tongue-squint grin-tongue-squint grin-tongue-wink grin-tongue-wink grin-wink grin-wink grip-horizontal grip-lines grip-lines-vertical grip-vertical gripfire grunt"
, "guilded guitar gulp h-square hacker-news hacker-news-square hackerrank hamburger hammer hamsa hand-holding hand-holding-heart hand-holding-medical hand-holding-usd hand-holding-water hand-lizard hand-lizard hand-middle-finger hand-paper hand-paper"
, "hand-peace hand-peace hand-point-down hand-point-down hand-point-left hand-point-left hand-point-right hand-point-right hand-point-up hand-point-up hand-pointer hand-pointer hand-rock hand-rock hand-scissors hand-scissors hand-sparkles hand-spock hand-spock hands"
, "hands-helping hands-wash handshake handshake handshake-alt-slash handshake-slash hanukiah hard-hat hashtag hat-cowboy hat-cowboy-side hat-wizard hdd hdd head-side-cough head-side-cough-slash head-side-mask head-side-virus heading headphones"
, "headphones-alt headset heart heart heart-broken heartbeat helicopter highlighter hiking hippo hips hire-a-helper history hive hockey-puck holly-berry home hooli hornbill horse"
, "horse-head hospital hospital hospital-alt hospital-symbol hospital-user hot-tub hotdog hotel hotjar hourglass hourglass hourglass-end hourglass-half hourglass-start house-damage house-user houzz hryvnia html5"
, "hubspot i-cursor ice-cream icicles icons id-badge id-badge id-card id-card id-card-alt ideal igloo image image images images imdb inbox indent industry"
, "infinity info info-circle innosoft instagram instagram-square instalod intercom internet-explorer invision ioxhost italic itch-io itunes itunes-note java jedi jedi-order jenkins jira"
, "joget joint joomla journal-whills js js-square jsfiddle kaaba kaggle key keybase keyboard keyboard keycdn khanda kickstarter kickstarter-k kiss kiss kiss-beam"
, "kiss-beam kiss-wink-heart kiss-wink-heart kiwi-bird korvue landmark language laptop laptop-code laptop-house laptop-medical laravel lastfm lastfm-square laugh laugh laugh-beam laugh-beam laugh-squint laugh-squint"
, "laugh-wink laugh-wink layer-group leaf leanpub lemon lemon less less-than less-than-equal level-down-alt level-up-alt life-ring life-ring lightbulb lightbulb line link linkedin linkedin-in"
, "linode linux lira-sign list list-alt list-alt list-ol list-ul location-arrow lock lock-open long-arrow-alt-down long-arrow-alt-left long-arrow-alt-right long-arrow-alt-up low-vision luggage-cart lungs lungs-virus lyft"
, "magento magic magnet mail-bulk mailchimp male mandalorian map map map-marked map-marked-alt map-marker map-marker-alt map-pin map-signs markdown marker mars mars-double mars-stroke"
, "mars-stroke-h mars-stroke-v mask mastodon maxcdn mdb medal medapps medium medium-m medkit medrt meetup megaport meh meh meh-blank meh-blank meh-rolling-eyes meh-rolling-eyes"
, "memory mendeley menorah mercury meteor microblog microchip microphone microphone-alt microphone-alt-slash microphone-slash microscope microsoft minus minus-circle minus-square minus-square mitten mix mixcloud"
, "mixer mizuni mobile mobile-alt modx monero money-bill money-bill-alt money-bill-alt money-bill-wave money-bill-wave-alt money-check money-check-alt monument moon moon mortar-pestle mosque motorcycle mountain"
, "mouse mouse-pointer mug-hot music napster neos network-wired neuter newspaper newspaper nimblr node node-js not-equal notes-medical npm ns8 nutritionix object-group object-group"
, "object-ungroup object-ungroup octopus-deploy odnoklassniki odnoklassniki-square oil-can old-republic om opencart openid opera optin-monster orcid osi otter outdent page4 pagelines pager paint-brush"
, "paint-roller palette palfed pallet paper-plane paper-plane paperclip parachute-box paragraph parking passport pastafarianism paste patreon pause pause-circle pause-circle paw paypal peace"
, "pen pen-alt pen-fancy pen-nib pen-square pencil-alt pencil-ruler penny-arcade people-arrows people-carry pepper-hot perbyte percent percentage periscope person-booth phabricator phoenix-framework phoenix-squadron phone"
, "phone-alt phone-slash phone-square phone-square-alt phone-volume photo-video php pied-piper pied-piper-alt pied-piper-hat pied-piper-pp pied-piper-square piggy-bank pills pinterest pinterest-p pinterest-square pizza-slice place-of-worship plane"
, "plane-arrival plane-departure plane-slash play play-circle play-circle playstation plug plus plus-circle plus-square plus-square podcast poll poll-h poo poo-storm poop portrait pound-sign"
, "power-off pray praying-hands prescription prescription-bottle prescription-bottle-alt print procedures product-hunt project-diagram pump-medical pump-soap pushed puzzle-piece python qq qrcode question question-circle question-circle"
, "quidditch quinscape quora quote-left quote-right quran r-project radiation radiation-alt rainbow random raspberry-pi ravelry react reacteurope readme rebel receipt record-vinyl recycle"
, "red-river reddit reddit-alien reddit-square redhat redo redo-alt registered registered remove-format renren reply reply-all replyd republican researchgate resolving restroom retweet rev"
, "ribbon ring road robot rocket rocketchat rockrms route rss rss-square ruble-sign ruler ruler-combined ruler-horizontal ruler-vertical running rupee-sign rust sad-cry sad-cry"
, "sad-tear sad-tear safari salesforce sass satellite satellite-dish save save schlix school screwdriver scribd scroll sd-card search search-dollar search-location search-minus search-plus"
, "searchengin seedling sellcast sellsy server servicestack shapes share share-alt share-alt-square share-square share-square shekel-sign shield-alt shield-virus ship shipping-fast shirtsinbulk shoe-prints shopify"
, "shopping-bag shopping-basket shopping-cart shopware shower shuttle-van sign sign-in-alt sign-language sign-out-alt signal signature sim-card simplybuilt sink sistrix sitemap sith skating sketch"
, "skiing skiing-nordic skull skull-crossbones skyatlas skype slack slack-hash slash sleigh sliders-h slideshare smile smile smile-beam smile-beam smile-wink smile-wink smog smoking"
, "smoking-ban sms snapchat snapchat-ghost snapchat-square snowboarding snowflake snowflake snowman snowplow soap socks solar-panel sort sort-alpha-down sort-alpha-down-alt sort-alpha-up sort-alpha-up-alt sort-amount-down sort-amount-down-alt"
, "sort-amount-up sort-amount-up-alt sort-down sort-numeric-down sort-numeric-down-alt sort-numeric-up sort-numeric-up-alt sort-up soundcloud sourcetree spa space-shuttle speakap speaker-deck spell-check spider spinner splotch spotify spray-can"
, "square square square-full square-root-alt squarespace stack-exchange stack-overflow stackpath stamp star star star-and-crescent star-half star-half star-half-alt star-of-david star-of-life staylinked steam steam-square"
, "steam-symbol step-backward step-forward stethoscope sticker-mule sticky-note sticky-note stop stop-circle stop-circle stopwatch stopwatch-20 store store-alt store-alt-slash store-slash strava stream street-view strikethrough"
, "stripe stripe-s stroopwafel studiovinari stumbleupon stumbleupon-circle subscript subway suitcase suitcase-rolling sun sun superpowers superscript supple surprise surprise suse swatchbook swift"
, "swimmer swimming-pool symfony synagogue sync sync-alt syringe table table-tennis tablet tablet-alt tablets tachometer-alt tag tags tape tasks taxi teamspeak teeth"
, "teeth-open telegram telegram-plane temperature-high temperature-low tencent-weibo tenge terminal text-height text-width th th-large th-list the-red-yeti theater-masks themeco themeisle thermometer thermometer-empty thermometer-full"
, "thermometer-half thermometer-quarter thermometer-three-quarters think-peaks thumbs-down thumbs-down thumbs-up thumbs-up thumbtack ticket-alt tiktok times times-circle times-circle tint tint-slash tired tired toggle-off toggle-on"
, "toilet toilet-paper toilet-paper-slash toolbox tools tooth torah torii-gate tractor trade-federation trademark traffic-light trailer train tram transgender transgender-alt trash trash-alt trash-alt"
, "trash-restore trash-restore-alt tree trello tripadvisor trophy truck truck-loading truck-monster truck-moving truck-pickup tshirt tty tumblr tumblr-square tv twitch twitter twitter-square typo3"
, "uber ubuntu uikit umbraco umbrella umbrella-beach uncharted underline undo undo-alt uniregistry unity universal-access university unlink unlock unlock-alt unsplash untappd upload"
, "ups usb user user user-alt user-alt-slash user-astronaut user-check user-circle user-circle user-clock user-cog user-edit user-friends user-graduate user-injured user-lock user-md user-minus user-ninja"
, "user-nurse user-plus user-secret user-shield user-slash user-tag user-tie user-times users users-cog users-slash usps ussunnah utensil-spoon utensils vaadin vector-square venus venus-double venus-mars"
, "vest vest-patches viacoin viadeo viadeo-square vial vials viber video video-slash vihara vimeo vimeo-square vimeo-v vine virus virus-slash viruses vk vnv"
, "voicemail volleyball-ball volume-down volume-mute volume-off volume-up vote-yea vr-cardboard vuejs walking wallet warehouse watchman-monitoring water wave-square waze weebly weibo weight weight-hanging"
, "weixin whatsapp whatsapp-square wheelchair whmcs wifi wikipedia-w wind window-close window-close window-maximize window-maximize window-minimize window-minimize window-restore window-restore windows wine-bottle wine-glass wine-glass-alt"
, "wix wizards-of-the-coast wodu wolf-pack-battalion won-sign wordpress wordpress-simple wpbeginner wpexplorer wpforms wpressr wrench x-ray xbox xing xing-square y-combinator yahoo yammer yandex"
, "yandex-international yarn yelp yen-sign yin-yang yoast youtube youtube-square zhihu"
].join(' ').split(' ')

__palette_div_html = (code,html)=>'<div class="np-palette col" data-code="'+code+'" draggable="true" title="'+code+'">'+html+'</div>'

const icon_code_HTMLs = new Map();
bs_icon_list.forEach((s)=>
    icon_code_HTMLs.set(
        'bs '+s,
        __palette_div_html('Bootstrap ' + s, '<i class="bi-'+s+'"></i>')
    )
);
fa_icon_list.forEach((s)=>
    icon_code_HTMLs.set(
        'fa '+s,
        __palette_div_html('Font Awesome ' + s, '<i class="fas fa-' + s + '"></i>')
    )
);
[...Array(emoji_codes.length).keys()].forEach((j)=>
    icon_code_HTMLs.set(
        'emoji ' + emoji_codes[j],
        __palette_div_html('Emoji ' + emoji_codes[j], emojis[j])
    )
);

const icon_codes = [...icon_code_HTMLs.keys()];
// setTimeout(function(){

function fillPallette(codes){
    _('#palette-row').innerHTML = codes.map(c => icon_code_HTMLs.get(c)).join('');
    [].forEach.call(_('.np-palette'),function(dom){
        dom.ondragstart = function(e){
            console.log('dom drag start')
            console.log(e);
            e.dataTransfer.effectAllowed = 'all';
            e.dataTransfer.setData('text', this.innerHTML);
            console.log(e);
        }
    });    
}


    // _('#palette-row').innerHTML = bs_icon_list.map((s)=>
    //     __palette_div_html(s,'<i class="bi-'+s+'"></i>')
    // ).join('')
    //  + fa_icon_list.map((s)=>
    //     __palette_div_html(s,'<i class="fas fa-'+s+'"></i>')
    // ).join('')
    //  + [...Array(emoji_codes.length).keys()].map((j)=>
    //     __palette_div_html(emoji_codes[j],emojis[j])
    // ).join('');

    // [].forEach.call(_('.np-palette'),function(dom){
    // dom.ondragstart = function(e){
    //     console.log('dom drag start')
    //     console.log(e);
    //     e.dataTransfer.effectAllowed = 'all';
    //     e.dataTransfer.setData('text', this.innerHTML);
    //     console.log(e);
    // }
    // });
// }, 1)


function randomizePalette(N=100){
    const codes = [];
    // elts = $('.np-palette');
    // elts.css('display','none');
    
    for(var j=0;j<N;j++){
        codes.push(icon_codes[Math.floor(Math.random()*icon_codes.length)]);
        // elts[Math.floor(Math.random()*elts.length)].style.display = '';
    }
    fillPallette(codes);
}

randomizePalette();

let icon_codes_q = '';
let icon_codes_filtered = []
let icon_codes_last_checked = -1;

function iconPaletteSearchRestart(q){
    icon_codes_q = q;
    icon_codes_filtered = []
    icon_codes_last_checked = -1;

    _('#palette-row').innerHTML = '';
}

function iconPaletteSearchAdd(N=100){
    const maxN = icon_codes_filtered.length + N;
    let add_HTML = '';
    while((icon_codes_filtered.length < maxN)
        &&(icon_codes_last_checked < icon_codes.length-1)){
        
        icon_codes_last_checked++;
        if(__isin_all(icon_codes_q, icon_codes[icon_codes_last_checked])){
            icon_codes_filtered.push(icon_codes[icon_codes_last_checked]);
            add_HTML += icon_code_HTMLs.get(icon_codes[icon_codes_last_checked]);
        }
    }
    _('#palette-row').innerHTML += add_HTML;
    [].forEach.call(_('.np-palette'),function(dom){
        dom.ondragstart = function(e){
            console.log('dom drag start')
            console.log(e);
            e.dataTransfer.effectAllowed = 'all';
            e.dataTransfer.setData('text', this.innerHTML);
            console.log(e);
        }
    });  
}

_('#inputIconSearch').oninput = function(){
    iconPaletteSearchRestart(_('#inputIconSearch').value.toLowerCase());
    iconPaletteSearchAdd();
    // fillPallette(icon_codes.filter(c => __isin_all(_('#inputIconSearch').value.toLowerCase(),c)));

    // [].forEach.call(_('.np-palette'), function(dom){
        
    //     dom.style.display = __isin_all(_('#inputIconSearch').value.toLowerCase(),dom.dataset['code'])?'':'none';
    // })
    // _('#palette-row').innerHTML = bs_icon_list.filter(s=>s.indexOf(this.value.toLowerCase())>=0).map(s=>'<div class="np-palette col" draggable="true"><i class="bi-'+s+'"></i></div>')
}

_('#palette-row').onscroll = function (e){
    if(_('#palette-row').scrollLeft
     + _('#palette-row').clientWidth
     > _('#palette-row').scrollWidth * 0.9 ) {
        iconPaletteSearchAdd();
    }
}