// obtain cookieconsent plugin
var cc = initCookieConsent();

// logo
var logo = '<svg width="39" height="30" viewBox="0 0 39 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 18.225C16.1981 18.225 13.4982 15.6538 13.2895 12.4046C13.9756 12.5566 14.6709 12.6839 15.3745 12.7857C15.7425 14.7295 17.4491 16.2 19.5 16.2C19.9283 16.2 20.3415 16.1355 20.7307 16.0164L20.577 13.2515L22.6918 14.7284C23.1579 14.1836 23.4868 13.5185 23.6256 12.7857C24.3291 12.6839 25.0245 12.5567 25.7106 12.4046C25.5019 15.6538 22.802 18.225 19.5 18.225ZM27.75 9.75H27.7494C27.6546 9.78097 27.5594 9.81135 27.4641 9.84128C26.8225 10.0428 26.1706 10.2208 25.509 10.3739C24.8526 10.5258 24.1866 10.6532 23.5125 10.7555C22.2039 10.9538 20.864 11.0568 19.5 11.0568C18.1361 11.0568 16.7962 10.9538 15.4876 10.7555C14.8134 10.6532 14.1475 10.5258 13.491 10.3739C12.8295 10.2208 12.1776 10.0428 11.536 9.84128C11.4407 9.81135 11.3455 9.78097 11.2507 9.75H11.25C11.25 9.75 11.25 11.9575 11.25 12C11.25 16.5563 14.9437 20.25 19.5 20.25C24.0548 20.25 27.7474 16.5589 27.75 12.0047V9.75Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M33.3675 22.1834L29.3065 19.3483L29.6292 25.1411C26.677 26.9391 23.2095 27.975 19.5001 27.975C15.7913 27.975 12.3244 26.9395 9.37251 25.1422L9.69524 19.3471L5.63256 22.1834C4.23426 20.7691 3.05001 19.1427 2.13426 17.3557C2.35821 16.4595 2.64884 15.5897 3.00224 14.7527C3.33194 13.9719 3.71601 13.2198 4.14869 12.5002C3.80901 11.7296 3.52574 10.9288 3.30389 10.1027C2.93054 8.71237 2.73029 7.25122 2.73029 5.74312C2.73029 4.9392 2.78811 4.149 2.89754 3.3753L8.70539 7.43092C9.28244 6.99397 9.88671 6.59115 10.5154 6.2256C13.1563 4.69005 16.2252 3.80993 19.5001 3.80993C22.7749 3.80993 25.8439 4.69005 28.4846 6.2256C29.1133 6.59115 29.7176 6.99397 30.2947 7.43092L36.1025 3.3753C36.2119 4.149 36.2698 4.9392 36.2698 5.74312C36.2698 7.25122 36.0694 8.71237 35.6962 10.1026C35.4743 10.9288 35.191 11.7296 34.8514 12.5002C35.284 13.2198 35.6681 13.9719 35.9978 14.7528C36.3512 15.5897 36.6418 16.4595 36.8658 17.3557C35.95 19.1427 34.7658 20.7691 33.3675 22.1834ZM38.0642 14.4588C37.7818 13.7365 37.4581 13.0352 37.0967 12.3568C37.8704 10.2994 38.2948 8.07098 38.2948 5.74312C38.2948 4.51073 38.1749 3.30652 37.9484 2.14035C37.9453 2.12445 37.9424 2.10855 37.9393 2.09265C37.7989 1.37978 37.6183 0.68145 37.3998 0L30.2957 4.96088C27.1849 2.9517 23.4789 1.78492 19.5001 1.78492C15.5212 1.78492 11.8152 2.9517 8.70434 4.96088L1.60026 0C1.38179 0.68145 1.20111 1.37978 1.06071 2.09265C1.05764 2.10855 1.05471 2.12453 1.05156 2.14042C0.825136 3.3066 0.705211 4.51073 0.705211 5.74312C0.705211 8.07098 1.12956 10.2994 1.90334 12.3568C1.54199 13.0352 1.21821 13.7365 0.935836 14.4588C0.541261 15.4684 0.226936 16.5181 6.10352e-05 17.6C0.473836 18.6107 1.02269 19.5792 1.64166 20.4967C2.32934 21.5161 3.10229 22.4733 3.94979 23.3585C4.42634 23.8562 4.92651 24.331 5.44859 24.7813L7.44149 23.3896L7.28526 26.1995C7.91579 26.6348 8.56986 27.0385 9.24666 27.4058C12.2951 29.0602 15.7879 30 19.5001 30C23.2129 30 26.7063 29.0599 29.755 27.405C30.4318 27.0376 31.0859 26.6338 31.7164 26.1984L31.5604 23.3909L33.5515 24.7813C34.0735 24.331 34.5737 23.8562 35.0503 23.3585C35.8978 22.4734 36.6707 21.5162 37.3584 20.4967C37.9774 19.5792 38.5262 18.6107 39.0001 17.6C38.7731 16.5181 38.4588 15.4684 38.0642 14.4588Z" fill="black"/></svg>';
var cookie = '🍪';

// run plugin with config object
cc.run({
    current_lang : 'en',
    autoclear_cookies : true,                   // default: false
    cookie_name: 'cc_cookie_demo1',             // default: 'cc_cookie'
    cookie_expiration : 365,                    // default: 182
    page_scripts: true,                         // default: false

    // auto_language: null,                     // default: null; could also be 'browser' or 'document'
    // autorun: true,                           // default: true
    // delay: 0,                                // default: 0
    // force_consent: false,
    // hide_from_bots: false,                   // default: false
    // remove_cookie_tables: false              // default: false
    // cookie_domain: location.hostname,        // default: current domain
    // cookie_path: "/",                        // default: root
    // cookie_same_site: "Lax",
    // use_rfc_cookie: false,                   // default: false
    // revision: 0,                             // default: 0

    gui_options: {
        consent_modal: {
            layout: 'box',                      // box,cloud,bar
            position: 'bottom right',           // bottom,middle,top + left,right,center
            transition: 'slide'                 // zoom,slide
        },
        settings_modal: {
            layout: 'box',                      // box,bar
            // position: 'left',                // right,left (available only if bar layout selected)
            transition: 'slide'                 // zoom,slide
        }
    },

    onFirstAction: function(){
        console.log('onFirstAction fired');
    },

    onAccept: function (cookie) {
        console.log('onAccept fired ...');
    },

    onChange: function (cookie, changed_preferences) {
        console.log('onChange fired ...');
    },

    languages: {
        'en': {
            consent_modal: {
                title: cookie + ' We use cookies! ',
                description: 'Hi, By checking this box, you give permission to store and use your personal data according to our <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
                primary_btn: {
                    text: 'Accept all',
                    role: 'accept_all'              // 'accept_selected' or 'accept_all'
                },
                secondary_btn: {
                    text: 'Reject all',
                    role: 'accept_necessary'        // 'settings' or 'accept_necessary'
                }
            },
            settings_modal: {
                title: logo,
                save_settings_btn: 'Save settings',
                accept_all_btn: 'Accept all',
                reject_all_btn: 'Reject all',
                close_btn_label: 'Close',
                cookie_table_headers: [
                    {col1: 'Name'},
                    {col2: 'Domain'},
                    {col3: 'Expiration'},
                    {col4: 'Description'}
                ],
                blocks: [
                    {
                        title: 'Cookie usage 📢',
                        description: 'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="privacy-policy.html" class="cc-link">privacy policy</a>.'
                    }, {
                        title: 'Strictly necessary cookies',
                        description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true          // cookie categories with readonly=true are all treated as "necessary cookies"
                        }
                    }, {
                        title: 'Performance and Analytics cookies',
                        description: 'Google Analytics uses several HTTP cookies on your website, e.g. the statistics cookie _ga to distinguish individual users and track how they engage with your website.',
                        toggle: {
                            value: 'analytics',     // there are no default categories => you specify them
                            enabled: false,
                            readonly: false
                        },
                        cookie_table: [
                            {
                                col1: '^_ga',
                                col2: 'google.com',
                                col3: '2 years',
                                col4: 'description ...',
                                is_regex: true
                            },
                            {
                                col1: '_gid',
                                col2: 'google.com',
                                col3: '1 day',
                                col4: 'description ...',
                            }
                        ]
                    }, {
                        title: 'Advertisement and Targeting cookies',
                        description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
                        toggle: {
                            value: 'targeting',
                            enabled: false,
                            readonly: false
                        }
                    }, {
                        title: 'More information',
                        description: 'For any queries in relation to my policy on cookies and your choices, please <a class="cc-link" href="../contacts.html">contact me</a>.',
                    }
                ]
            }
        }
    }

});
