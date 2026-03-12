const button = document.getElementById("btn")

button.addEventListener("click", async () => {

    const response = await fetch("/api")
    const data = await response.text()

    console.log(data)

})