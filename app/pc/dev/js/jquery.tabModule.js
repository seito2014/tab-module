(function () {

    'use strict';

    $.fn.tabModule = function (option) {

        var $tab = $(this);

        var defaults = {
            lazyload: false,
            activeClass: 'is-active',
            onClicked: function () {
            }
        };

        var setting = $.extend(defaults, option);

        var name = $tab.attr('id');

        var $tabMenus = $tab.find('#' + name + '-menu'),
            $tabMenusItem = $tabMenus.find('.' + name + '-menu-item'),
            $tabMenusLink = $tabMenus.find('a'),
            $tabAreas = $tab.find('#' + name + '-target'),
            $tabAreasItem = $tabAreas.children('.' + name + '-target-item');

        var changeAreaTime;

        //クリック時の処理
        function tabClickHandler(e) {

            clearTimeout(changeAreaTime);

            e.preventDefault();

            var $this = $(this);

            //同じタブをクリックしても反応させない
            if ($this.parent().hasClass(setting.activeClass)) {
                return;
            }

            var target = $this.attr('href');
            var targetHeight = $(target).outerHeight();

            //カレントの付け替え
            $tabMenusItem.removeClass(setting.activeClass);
            $this.parent().addClass(setting.activeClass);

            $tabAreas.css('height', targetHeight);

            //タブエリアを切り替え
            $tabAreasItem.not(target).removeClass(setting.activeClass);
            $(target).show();
            changeAreaTime = setTimeout(function () {
                $tabAreasItem.not(target).hide();
                $(target).addClass(setting.activeClass);

                $(window).trigger('stickySettingChange');

            }, 1);

            //lazyloadオプションがtrueならスクロールイベントを発火させる
            if (setting.lazyload === true) {
                $(window).trigger('scroll');
            }

            //callback
            setting.onClicked.call(this);
        }

        //タブエリアはposition:absoluteになってるので、高さを設定
        $tabAreas.css('height', $tabAreasItem.eq(0).outerHeight());

        $tabMenusLink.on('click', tabClickHandler);

    };
})();