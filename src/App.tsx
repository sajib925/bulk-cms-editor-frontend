import { useState } from "react";
import { FeedbackPage } from "./app/views/Feedback";
import { HelpPage } from "./app/views/Help";
import { LicensePage } from "./app/views/License";
import { SettingsPage } from "./app/views/Settings";
import { FeedbackIcon } from "./assets/FeedbackIcon";
import { HelpIcon } from "./assets/HelpIcon";
import { LockIcon } from "./assets/LockIcon";
import { SettingsIcon } from "./assets/SettingsIcon";
import { StyleIcon } from "./assets/StyleIcon";
import Collections from "./app/views/Collections";
import { Tabs } from "./components/common/Tabs";
import { LoadingScreen } from "./components/common/Loading";
import { ViewTableIcon } from "./assets/TableIcon";

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  if (isLoading) return <LoadingScreen message={"Verifying registration and setting things up..."} />;

  return (
    <main className={"h-screen w-full max-w-full overflow-hidden text-white"}>
      
        <Tabs
          isSticky={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            {
              icon: <ViewTableIcon />,
              menuItem: "Table",
              render: () => (
                <div className={"w-full"}>
                  <Collections />
                </div>
              ),
            },
            {
              icon: <SettingsIcon />,
              menuItem: "Settings",
              render: () => (
                <div className={"w-full"}>
                  <SettingsPage />
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
