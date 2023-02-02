exports.getDate = function () {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    const day = today.toLocaleDateString("pt-BR", options);
    return day[0].toUpperCase() + day.substring(1);

    
}