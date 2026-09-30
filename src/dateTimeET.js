//function dateFormattedET(){
const dateFormattedET = function(){
	let timeNow = new Date();
	const monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
	return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ', ' + timeNow.getFullYear();
}

const timeFormattedET = function() {
    let timeNow = new Date();
    let hourNow = timeNow.getHours();
    let minuteNow = timeNow.getMinutes();
    let secondNow = timeNow.getSeconds();

    if (minuteNow < 10) {
        minuteNow = '0' + minuteNow;
    }

    if (secondNow < 10) {
        secondNow = '0' + secondNow;
    }

    return hourNow + ':' + minuteNow + ':' + secondNow;
}

const weekDayET = function(){
	let timeNow = new Date();
	const weekDayNamesET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'];
	return weekDayNamesET[timeNow.getDay()];
}

module.exports = {dateET: dateFormattedET, timeET: timeFormattedET, weekDayET: weekDayET}