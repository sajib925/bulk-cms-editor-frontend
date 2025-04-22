import { GlobalIcon } from "@/assets/GlobalIcon.tsx";
import { Title } from "@/components/typography/Title.tsx";
import { FeedbackIcon } from "@/assets/FeedbackIcon.tsx";
import { Description } from "@/components/typography/Description.tsx";
import { CustomSelect, SelectItemType } from "@/components/common/CustonSelect.tsx";
import { Input } from "@/components/ui/input.tsx";
// import { useAppStore } from "@/store/AppStore.ts";

const behaviourSelectData: SelectItemType[] = [
  { label: "On Page Load", value: "onPageLoad" },
  { label: "On Exit Intent", value: "onExitIntent" },
  { label: "On User Action", value: "onUserAction" },
  { label: "Scroll Trigger", value: "scrollTrigger" },
  { label: "Inactivity Timer", value: "inactivityTimer" },
  { label: "Time Based", value: "timeBased" },
  { label: "Cookie-Based", value: "cookieBased" },
];

const timeSelectData: SelectItemType[] = [
  { label: "Immediate", value: "immediate" },
  { label: "Delayed (seconds)", value: "delayedSeconds" },
  { label: "Delayed (percentage scrolled)", value: "delayedScrollPercentage" },
];

export const OpenBehaviour = ({ title }: { title: string }) => {
  // const { triggerSettings, updateSettings } = useAppStore();

  return (
    <div className={"mt-5 w-full rounded-[10px] bg-[#292929]"}>
      <div className={"mb-5 flex gap-3 border-b border-b-[#FFFFFF21] p-5"}>
        <div className={"shrink-0"}>
          <GlobalIcon />
        </div>
        <div>
          <Title className={"mb-[5px] flex items-center gap-2"}>
            {title} <FeedbackIcon />
          </Title>
          <Description className={"text-[#FFFFFFCC]"}>
            Enhance user engagement with a fully customizable popup builder designed to trigger popups based on user
            behavior.
          </Description>
        </div>
      </div>

      <div className={"px-5 pb-5"}>
        <div className={"flex items-center gap-3 pb-5"}>
          {/* <CustomSelect
            contentClassName={"w-[168px]"}
            triggerClassName={"w-full"}
            items={behaviourSelectData}
            value={triggerSettings.trigger}
            setValue={(v) => {
              updateSettings("trigger", v);
            }}
          /> */}
          {/* <CustomSelect
            contentClassName={"w-[236px]"}
            triggerClassName={"w-full"}
            items={timeSelectData}
            value={triggerSettings.delayType}
            setValue={(v) => {
              updateSettings("delayType", v);
            }}
          /> */}
        </div>
        {/* <Input
          type="number"
          value={triggerSettings.delaySeconds}
          placeholder="After 55 seconds delay"
          onChange={(e) => updateSettings("delaySeconds", e.target.value)}
          className={
            "h-[26px] rounded !border !border-[#FFFFFF21] bg-[#292929] px-3 py-[5px] text-[12px] font-medium leading-4 placeholder:text-[12px] placeholder:font-medium placeholder:leading-4 placeholder:text-[#FFFFFF99] focus-visible:ring-1 focus-visible:ring-[#006ACC]"
          }
        /> */}
        <div className={"mt-5"}>
          <Description className={"flex items-center gap-2"}>
            <FeedbackIcon /> How it works
          </Description>
        </div>
      </div>
    </div>
  );
};
