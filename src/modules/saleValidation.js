export const saleValidation = () => {
    const forms = document.getElementsByTagName("form");

    const count = document.getElementById("calc-total");
    console.log(forms);

    const statusBlock = document.createElement("div");
    statusBlock.classList.add("loading");
    const loadText = "Загрузка...";
    const errorText = "Ошибка. Попробуйте еще раз!";
    const unvalidText = "Проверьте введенные данные!";
    const successText = "Спасибо! Менеджер с нами свяжется!";

    let success = true;

    for (let oneForm of forms) {
        const inputName = oneForm.getElementsByTagName("input")[0];
        inputName.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Zа-яА-Я\s]/g, "");
        });
        inputName.addEventListener("focus", (e) => {
            e.target.style.border = "1px solid #dfdfdf";
        });

        const inputPhone = oneForm.getElementsByTagName("input")[1];
        inputPhone.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9\s\+]/g, "");
        });
        inputPhone.addEventListener("focus", (e) => {
            e.target.style.border = "1px solid #dfdfdf";
        });
    }

    const validate = (list) => {
        success = true;
        list.forEach((input) => {
            switch (input.name) {
                case "fio":
                    if (input.value.length > 1) {
                        return success;
                    } else {
                        input.style.border = "1px solid #f30b01";
                        statusBlock.textContent = unvalidText;
                        return (success = false);
                    }
                    break;
                case "phone":
                    if (input.value.length > 5 && input.value.length < 17) {
                        return success;
                    } else {
                        statusBlock.textContent = unvalidText;
                        input.style.border = "1px solid #f30b01";
                        return (success = false);
                    }
                    break;
            }
        });
    };

    const sendData = (data) => {
        return fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
    };

    for (let form of forms) {
        const submitForm = () => {
            const formElements = form.querySelectorAll("input[type='text']");
            const formData = new FormData(form);
            let formBody;

            if (count) {
                formBody = { count: +count.value };
            } else {
                formBody = {};
            }

            statusBlock.textContent = loadText;
            form.append(statusBlock);

            formData.forEach((val, key) => {
                formBody[key] = val;
            });

            validate(formElements);
            console.log(formBody);

            if (success) {
                sendData(formBody)
                    .then((data) => {
                        statusBlock.textContent = successText;
                        setTimeout(() => statusBlock.remove(), 2000);
                        formElements.forEach((input) => {
                            input.value = "";
                        });
                    })
                    .catch((error) => {
                        statusBlock.textContent = errorText;
                    });
            }
            //  else {
            //     // alert("Данные не валидны!");
            //     // statusBlock.textContent = errorText;
            // }
        };

        try {
            if (!form) {
                throw new Error("Верните форму на место!");
            }

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                let inputs = form.querySelectorAll("input");
                inputs.forEach((input) => (input.style.border = "1px solid #dfdfdf"));
                submitForm();
            });
        } catch (error) {
            console.log(error.message);
        }
    }
};
