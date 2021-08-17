import Swal from 'sweetalert2';

export function Alert(icon, title, message, buttonText) {

    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        confirmButtonText: buttonText ? buttonText : 'Ok'
    });

}


export function ConfirmAlert(icon, title, message, buttonText, confirm_title, confirm_message, confirm_icon, callBack, router) {

    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: buttonText
    }).then(async(result) => {
        if (result.isConfirmed) {

            await callBack();

            Swal.fire(
                confirm_title,
                confirm_message,
                confirm_icon
            ).then( (confirm) => {
                if (router !== undefined || router !== null) {
                    router.reload();
                }
            })



        }
    });

}