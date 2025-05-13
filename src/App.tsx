import { useState } from "react";
import { FeedbackPage } from "./app/views/Feedback";
import { HelpPage } from "./app/views/Help";
import { LicensePage } from "./app/views/License";
import { FeedbackIcon } from "./assets/FeedbackIcon";
import { HelpIcon } from "./assets/HelpIcon";
import { LockIcon } from "./assets/LockIcon";
import { Tabs } from "./components/common/Tabs";
import { LoadingScreen } from "./components/common/Loading";
import { ViewTableIcon } from "./assets/TableIcon";
import Collections from "./app/views/Collections";

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  


  if (isLoading) return <LoadingScreen message={"Verifying registration and setting things up..."} />;

  return (
    <main className={"h-screen w-full max-w-full overflow-hidden text-white font-inter"}>
      
        <Tabs
          isSticky={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            {
              icon: <ViewTableIcon />,
              menuItem: "Edit",
              render: () => (
                <div className={"w-full"}>
                  <Collections />
                </div>
              ),
            },
            {
              icon: <LockIcon />,
              menuItem: "License",
              render: () => (
                <div className={"flex w-full"}>
                  <LicensePage isLoading={false} />
                </div>
              ),
            },
            {
              icon: <HelpIcon />,
              menuItem: "Help",
              render: () => (
                <div className={"flex w-full"}>
                  <HelpPage />
                </div>
              ),
            },
            {
              icon: <FeedbackIcon />,
              menuItem: "Feedback",
              render: () => (
                <div className={"flex w-full"}>
                  <FeedbackPage />
                </div>
              ),
            },
          ]}
          
        />
      </main>
  );
}

export default App;
