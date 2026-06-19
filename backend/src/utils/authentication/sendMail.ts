export const sendMail = async (to: string,subject: string,
    text: string) => {
        console.log("To:", to);
        console.log("Subject:", subject);
        console.log("Message:", text);
    };