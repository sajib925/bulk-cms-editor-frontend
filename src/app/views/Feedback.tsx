import { FormEvent, useState } from "react";
import { z, ZodError } from "zod";
import axios from "axios";

// import axios from "axios";

const messageSchema = z.object({
  message: z.string().min(1, "Feedback should not be empty"),
  email: z.string().email().min(1, "Email should not be empty"),
});

export const FeedbackPage = () => {
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [errors, setErrors] = useState<any>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //     if (user) setEmail(user.email);
  // }, [user]);

  const validate = () => {
    try {
      messageSchema.parse({
        message,
        email,
      });

      setErrors({});

      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const errorsByField: { [x: string]: string } = {};

        for (const issue of err.errors) {
          const { path, message } = issue;
          const field = path.length === 1 ? path[0] : path.join(".");

          errorsByField[field] = message;
        }
        setErrors(errorsByField);
      }
    }
  };

  const handleFeedbackSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { siteId } = await webflow.getSiteInfo();
    if (validate()) {
      setIsLoading(true);
      try {
        await axios({
          method: "post",
          url: `${import.meta.env.VITE_FEEDBACK_API}/feedback`,
          data: {
            app_name: "popup-builder",
            feedback_message: message,
            email: email,
            site_id: siteId,
          },
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => res.data)
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }

      webflow.notify({
        type: "Success",
        message: "Feedback successfully submitted",
      });
      setIsLoading(false);
      setMessage("");
      setEmail("");
    }
  };

  return (
    <div className={"min-h-[calc(100vh-51px)] w-full bg-[#1E1E1E] p-5"}>
      <div className="w-full">
        <p className={"text-[0.8rem] font-semibold"}>Help us make `Popup Builder` better!</p>
        <p className="mb-1 w-full max-w-[607px] text-[0.71rem] text-[#A3A3A3]">
          Use the form below to share your feedback.
        </p>
        <form className="w-full" onSubmit={(e) => handleFeedbackSubmit(e)}>
          <div className="mb-2">
            <p className="mb-1 box-border inline-block text-[0.77rem] text-[#F5F5F5]">Email</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-inner-shadow w-full rounded-[4px] border-[1px] border-[#ffffff24] bg-[#00000015] p-1 px-[0.3rem] text-[0.7rem] leading-[1.1rem] text-[#f5f5f5] shadow-xl placeholder:text-[#ffffff66] focus:outline-none"
            />

            {errors.email && <span className="text-[0.74rem] text-red-400">{errors.email}</span>}
          </div>
          <p className="mb-1 box-border inline-block text-[0.77rem] text-[#F5F5F5]">Your feedback</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your feedback..."
            className="input-inner-shadow h-[125px] w-full resize-none rounded-[4px] border-[1px] border-[#ffffff24] bg-[#00000015] p-1 px-[0.3rem] text-[0.7rem] leading-[1.1rem] text-[#D9D9D9] shadow-xl placeholder:text-[#ffffff66] focus:outline-none"
          ></textarea>
          {errors.message && <span className="text-[0.74rem] text-red-400">{errors.message}</span>}
          <div className="mt-5 w-full gap-5">
            <button
              className="boxShadows-action-colored flex w-full items-center justify-center gap-1 rounded-[4px] border-[1px] border-[#363636] bg-[#0073E6] px-5 py-1 text-center text-[0.77rem]"
              type="submit"
            >
              {isLoading ? "Loading..." : "Share feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
