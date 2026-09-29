(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Open / closed status, using Jerusalem time
  var HOURS = { 0: [570, 1200], 1: [570, 1200], 2: [570, 1200], 3: [570, 1200], 4: [570, 1200], 5: [570, 840] };
  var DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  function jerusalemNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
    return { day: day, minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
  }

  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function nextOpening(day) {
    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      if (HOURS[d]) return { day: d, time: HOURS[d][0], tomorrow: i === 1 };
    }
  }

  var status = document.getElementById('open-status');
  try {
    var now = jerusalemNow();
    document.querySelectorAll('.hours tr[data-days]').forEach(function (row) {
      if (row.dataset.days.split(',').map(Number).indexOf(now.day) !== -1) row.classList.add('today');
    });

    var today = HOURS[now.day];
    if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      status.textContent = 'פתוח עכשיו, עד ' + fmt(today[1]);
      status.className = 'open-status is-open';
    } else {
      var next;
      if (today && now.minutes < today[0]) next = 'היום ב-' + fmt(today[0]);
      else {
        var n = nextOpening(now.day);
        next = (n.tomorrow ? 'מחר' : 'ביום ' + DAY_NAMES[n.day]) + ' ב-' + fmt(n.time);
      }
      status.textContent = 'סגור כרגע. נפתח ' + next;
      status.className = 'open-status is-closed';
    }
  } catch (e) {
    status.textContent = '';
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section-head, .card, .why, .quote, .score, .split > *, .visit > *');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
