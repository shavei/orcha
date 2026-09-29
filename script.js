(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Opening hours in minutes from midnight, Jerusalem time. Keep in sync with the table in index.html.
  var HOURS = { 0: [570, 1200], 1: [570, 1200], 2: [570, 1200], 3: [570, 1200], 4: [570, 1200], 5: [570, 840] };
  var DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  function jerusalemNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday),
      minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10)
    };
  }

  function fmt(min) {
    var m = min % 60;
    return Math.floor(min / 60) + ':' + (m < 10 ? '0' : '') + m;
  }

  function nextOpening(day, minutes) {
    var today = HOURS[day];
    if (today && minutes < today[0]) return 'היום ב-' + fmt(today[0]);
    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      if (HOURS[d]) return (i === 1 ? 'מחר' : 'ביום ' + DAY_NAMES[d]) + ' ב-' + fmt(HOURS[d][0]);
    }
  }

  var line = document.getElementById('status-line');
  var sign = document.getElementById('door-sign');
  var word = document.getElementById('door-word');
  var detail = document.getElementById('door-detail');

  try {
    var now = jerusalemNow();
    document.querySelectorAll('.hours tr[data-days]').forEach(function (row) {
      if (row.dataset.days.split(',').map(Number).indexOf(now.day) !== -1) row.classList.add('today');
    });

    var today = HOURS[now.day];
    if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      word.textContent = 'פתוח';
      detail.textContent = 'עד ' + fmt(today[1]);
      line.textContent = 'פתוח עכשיו, עד ' + fmt(today[1]) + ' · הלל 31';
      line.className = 'open';
    } else {
      var next = nextOpening(now.day, now.minutes);
      word.textContent = 'סגור';
      detail.textContent = 'נפתח ' + next;
      sign.classList.add('is-closed');
      line.textContent = 'סגור כרגע, נפתח ' + next + ' · הלל 31';
      line.className = 'closed';
    }
  } catch (e) {
    sign.hidden = true;
  }
})();
