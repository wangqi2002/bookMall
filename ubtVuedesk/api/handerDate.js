export const handerDate = (time) => {
    let spe = /-|T|:/;
    let prevTime = time.split(spe);
    let hours = parseInt(prevTime[3])+8;
    let result = hours + ':' + prevTime[4];

    if (parseInt(prevTime[0]) !== new Date().getFullYear()) {
        return prevTime[0] + '年' + prevTime[1] + '月' + prevTime[2] + '日';
    } else if (parseInt(prevTime[1]) !== new Date().getMonth() + 1) {
        return prevTime[1] + '月' + prevTime[2] + '日';
    } else if (parseInt(prevTime[2]) !== new Date().getDate()) {
        return prevTime[1] + '月' + prevTime[2] + '日' + result.toString()
    }
    else {
        return result.toString()
    }
}
