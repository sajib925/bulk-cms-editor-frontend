import { LoadingScreen } from "@/components/common/Loading.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { RightArrowMoveUpIcon } from "@/assets/RightArrowMoveup.tsx";

export type ProjectMetaResponse = {
  app_title: string;
  meta_key: string;
  meta_value: MetaValue[];
};

export type MetaValue = {
  name: string;
  url: string;
};

export const HelpPage = () => {
  const [tutorials, setTutorials] = useState<MetaValue[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    setTutorials([]);
    setIsLoading(false);
    getProjectMeta().then(() => setIsLoading(false));
  }, []);

  const getProjectMeta = async () => {
    try {
      const { data } = await axios.post<ProjectMetaResponse>(`${import.meta.env.VITE_FEEDBACK_API}/project-meta`, {
        app_name: "popup-builder",
        key: "tutorials",
      });

      setTutorials(data.meta_value);
    } catch (error) {
      console.log("err fetching tutorials: ", error);
    }
  };

  if (isLoading) return <LoadingScreen message={"Loading..."} height={"min-h-[calc(100vh-45px)]"} />;

  return (
    <div className={"min-h-[calc(100vh-51px)] w-full p-5"}>
      <div>
        <p className={"mb-1 text-[0.8rem] font-semibold"}>Need help setting up the Social Share button?</p>
        <p className="mb-1 w-full text-[0.71rem] text-[#A3A3A3]">
          Check these step by step video tutorials to learn how to install, uninstall & customize your popup. You will
          also be able to learn how to use templates. If you still need more help, please get in touch:{" "}
          <a href={"mailto:flowappz23@gmail.com"} className={"underline"}>
            flowappz23@gmail.com
          </a>
        </p>
      </div>

      <div>
        <p className={"mb-2 text-[0.8rem] font-semibold"}>Watch our pre-recorded tutorials to get started:</p>

        <div>
          {tutorials?.map(({ name, url }, index) => {
            return (
              <p key={index} className="mb-1 w-full max-w-[607px] text-[0.71rem] text-[#A3A3A3]">
                1.{" "}
                <a href={url} className="mb-1 inline-flex items-center gap-1 underline" target={"_blank"}>
                  {name}
                  <RightArrowMoveUpIcon />
                </a>
                <br />
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
