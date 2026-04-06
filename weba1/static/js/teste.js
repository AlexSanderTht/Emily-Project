function Colapse_Switcher() {
            // Switch theme color
            var $styleSwitcher = $('#style_switcher');
            if (!$styleSwitcher.hasClass('switcher_open')) {
                $styleSwitcher.addClass('switcher_open')
            } else {
                $styleSwitcher.removeClass('switcher_open')
            }
        };