import { Title } from "@/components/typography/Title.tsx";
import { Description } from "@/components/typography/Description.tsx";
import { FeedbackIcon } from "@/assets/FeedbackIcon.tsx";
import { Input } from "@/components/ui/input.tsx";
import { CodeIcon } from "@/assets/CodeIcon.tsx";
import { IntegrationsLogoIcon } from "@/assets/IntegrationsLogoIcon.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { CloseCircle } from "@/assets/CloseCircle.tsx";
import { SlackLogoIcon } from "@/assets/SlackLogoIcon.tsx";
import { NavigatorIcon } from "@/assets/NavigatorIcon.tsx";
import { EmailIcon } from "@/assets/EmailIcon.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
// import { Switch } from "@/components/ui/switch.tsx";
// import { AddEmailDialog } from "@/components/AddEmailDialog.tsx";
// import { BehaviourSelectTabs } from "@/components/BehaviourSelectTabs.tsx";
// import { useAppStore } from "@/store/AppStore.ts";

export const SettingsPage = () => {
  // const { updateAnalyticsStatus, googleAnalyticsStatus } = useAppStore();

  return (
    <div className={"h-[calc(100vh-50px)] overflow-auto px-5 py-[30px]"}>
      <div className={"mb-4"}>
        <Title className={"mb-2"}>Settings</Title>
        <Description className={"text-[#FFFFFFCC]"}>
          You're almost done! Check your settings and publish your campaign.
        </Description>
      </div>
      {/* <BehaviourSelectTabs /> */}

      <div className={"mt-5 w-full rounded-[10px] bg-[#292929]"}>
        <div className={"mb-5 flex gap-3 border-b border-b-[#FFFFFF21] p-5"}>
          <div className={"shrink-0"}>
            <CodeIcon />
          </div>
          <div>
            <Title className={"mb-[5px] flex items-center gap-2"}>
              Integrations <FeedbackIcon />
            </Title>
            <Description className={"text-[#FFFFFFCC]"}>
              Define where you would like to keep the list of subscribers.
            </Description>
          </div>
        </div>
        <div className={"px-5 pb-5"}>
          <div className={"flex h-10 w-full items-center gap-3 rounded-[8px] border border-[#FFFFFF21] px-5"}>
            <IntegrationsLogoIcon />
            <Description className={"flex items-center gap-2"}>
              <FeedbackIcon /> We support 13 integrations, but you do not use any of them.
            </Description>
          </div>

          <div className={"mt-5"}>
            <DropdownMenu>
              <DropdownMenuTrigger className={"mb-0 pb-0"}>
                <Description className={"flex items-center gap-2"}>
                  <CloseCircle />
                  <span className={"text-[#006ACC] underline"}>Add Integrations</span>
                </Description>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={"start"}
                className={"flex w-[471px] flex-col gap-5 rounded-[10px] !border !border-[#FFFFFF26] !bg-[#373737] p-5"}
              >
                <Input
                  type="text"
                  placeholder="After 55 seconds delay"
                  className={
                    "h-9 rounded-[8px] !border !border-[#FFFFFF21] bg-transparent px-3 py-[5px] text-[12px] font-medium leading-4 placeholder:text-[12px] placeholder:font-medium placeholder:leading-4 placeholder:text-[#FFFFFF99] focus-visible:ring-1 focus-visible:ring-[#006ACC]"
                  }
                />
                <div className={"flex h-12 items-center gap-2 rounded-[8px] border border-[#FFFFFF21] px-3 py-2"}>
                  <SlackLogoIcon />
                  <Title>Slack</Title>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Description className={"flex items-center gap-2"}>
              <FeedbackIcon /> How it works
            </Description>
          </div>
        </div>
      </div>

      <div className={"mt-5 w-full rounded-[10px] bg-[#292929]"}>
        <div className={"mb-5 flex gap-3 border-b border-b-[#FFFFFF21] p-5"}>
          <div className={"shrink-0"}>
            <NavigatorIcon />
          </div>
          <div>
            <Title className={"mb-[5px] flex items-center gap-2"}>Google Analytics</Title>
            <Description className={"text-[#FFFFFFCC]"}>To send data integrated with Google Analytics.</Description>
          </div>
        </div>

        <div className={"px-5 pb-5"}>
          <div className={"flex h-10 w-full items-center gap-1 rounded-[8px] border border-[#FFFFFF21] px-3"}>
            {/* <Switch value={`${googleAnalyticsStatus}`} onCheckedChange={(event) => updateAnalyticsStatus(event)} /> */}
            <Description className={"flex items-center gap-2"}>
              When activated, this campaign will integrate with Google Analytics if your website has a GA or GTM code.
            </Description>
          </div>

          <div className={"mt-5 flex flex-col gap-3"}>
            <Description className={"flex items-center gap-2"}>
              <FeedbackIcon />
              If you used Google Tag Manager for GA code, use the linked for tracking popup Google Analytics.{" "}
              <a href={"#"} className={"underline"}>
                Instructions
              </a>
            </Description>
            <Description className={"flex items-center gap-2"}>
              <FeedbackIcon /> How it works
            </Description>
          </div>
        </div>
      </div>

      <div className={"mt-5 w-full rounded-[10px] bg-[#292929]"}>
        <div className={"mb-5 flex gap-3 border-b border-b-[#FFFFFF21] p-5"}>
          <div className={"shrink-0"}>
            <EmailIcon />
          </div>
          <div>
            <Title className={"mb-[5px] flex items-center gap-2"}>Self Email Notifications</Title>
            <Description className={"text-[#FFFFFFCC]"}>
              Receive an email notification each time someone submits to your popup form
            </Description>
          </div>
        </div>

        <div className={"px-5 pb-5"}>
          <div className="mb-[30px] flex items-center space-x-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-[12px] font-medium leading-[16px] text-white/80">
              Use my registered email address.
            </label>
          </div>
          <div>
            {/* <AddEmailDialog /> */}
            <Description className={"flex items-center gap-2"}>
              <FeedbackIcon /> How it works
            </Description>
          </div>
        </div>
      </div>
    </div>
  );
};
