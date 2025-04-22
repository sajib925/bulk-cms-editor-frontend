import { LoadingScreen } from "@/components/common/Loading.tsx";

import { useEffect, useState } from "react";
import AdminService, { LicenseInfo } from "@/services/AdminService.ts";
import { RightArrowMoveUpIcon } from "@/assets/RightArrowMoveup.tsx";



// import AdminService, { LicenseInfo } from "../Services/AdminService.ts";
// import { useAppContext } from "../store/AppContext.tsx";
// import { RightArrowMoveUpIcon } from "../icons/RightArrowMoveup.tsx";

export const LicensePage = ({ isLoading }: { isLoading: boolean }) => {
  // const { license, setLicense } = useAppContext();
  const [license ,setLicense] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true);
  const [siteToken, setSiteToken] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    loadSiteToken().then(() => setLoading(false));
  }, []);

  async function loadSiteToken() {
    const siteToken = await webflow.getSiteInfo();
    setSiteToken(siteToken.siteId);
  }

  return (
    <div className="min-h-[calc(100vh-42px)] bg-[#1E1E1E]">
      {isLoading && loading && <LoadingScreen message="checking license..." height={"min-h-[calc(100vh-42px)]"} />}

      {!isLoading && !loading && (
        <div className="flex w-full flex-col gap-4 px-8 py-4">
          {license?.valid ? (
            <ActiveLicenseDisplay license={license} />
          ) : (
            <InactiveLicenseDisplay siteId={siteToken} onActivate={(newLicense) => setLicense(newLicense)} />
          )}

          <div className="flex flex-col gap-1 border-t border-t-[#FFFFFF21] pt-5">
            <p className={"mb-1 mt-1 text-[14px] font-bold"}>Don’t have a license key?</p>
            <p className={"mb-4 w-full max-w-[607px] text-[12px] text-[#FFFFFFCC]"}>
              If you don’t have an account with FlowAppz, you need to create one. Then buy a license key.
            </p>

            <a
              className={
                "boxShadows-action-secondary action-secondary-background flex w-fit items-center gap-2 rounded-[6px] p-1 px-[10px] py-[7px] text-center text-[12px] font-semibold hover:text-white"
              }
              href={`${import.meta.env.VITE_ADMIN_API_BASE_URL}/dashboard/products/social-share/licenses`}
              target={"_blank"}
            >
              Buy a new license key <RightArrowMoveUpIcon />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function ActiveLicenseDisplay({ license }: { license: LicenseInfo }) {
  //const { setLicense } = useAppContext(); // Use context here
  const [_, setLicense] = useState<any>()
  const checkLicenseLink = `${import.meta.env.VITE_ADMIN_API_BASE_URL}/dashboard/products/social-share/licenses`;

  const [licenseKey, setLicenseKey] = useState<string>(license?.key || "");
  const [isDeActivatingLoading, setIsDeActivatingLoading] = useState(false);

  async function deActivateLicense() {
    try {
      setIsDeActivatingLoading(true);
      const deactivatedLicense = await AdminService.deActivateLicense(licenseKey);
      setIsDeActivatingLoading(false);
      console.log(deactivatedLicense);
      if (deactivatedLicense) {
        // Update context with deactivated license
        setLicense({ ...deactivatedLicense, valid: 0 });
        setLicenseKey(""); // Clear the license key input after deactivation
      } else {
        console.log("License was not deactivated");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function maskLicenseKey(key: string): string {
    if (key.length < 8) return key; // If the key is too short, return as is
    return key.slice(0, 4) + "*".repeat(key.length - 8) + key.slice(-4);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className={"mt-1 text-[14px] font-bold"}>License key activated</p>
        <p className={"mb-4 text-[0.71rem] text-[#A3A3A3]"}>
          {/* Your key is valid until - {license.expireAt}. */}
          <a href={checkLicenseLink} className="inline-flex items-center underline" target={"_blank"}>
            Check your available license keys here
            <RightArrowMoveUpIcon />
          </a>
        </p>

        <div className="w-full max-w-[304px]">
          <input
            className="input-inner-shadow w-full rounded-[4px] border-[1px] border-[#ffffff24] bg-[#00000015] p-1 px-[0.3rem] text-[0.7rem] leading-[1.1rem] text-[#f5f5f5] shadow-xl placeholder:text-[#ffffff66] focus:outline-none"
            value={maskLicenseKey(licenseKey)}
            disabled
          />
        </div>

        <div>
          <button
            onClick={deActivateLicense}
            className="boxShadows-action-colored mt-4 w-fit rounded-[6px] border-[1px] border-[#363636] bg-[#006ACC] px-[10px] py-[7px] text-center text-[12px] font-semibold"
            disabled={license?.valid === 0 || isDeActivatingLoading}
          >
            {isDeActivatingLoading ? "Loading..." : "Deactivate license"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InactiveLicenseDisplay({ onActivate }: { siteId: string; onActivate: (license: LicenseInfo) => void }) {
  //const { license } = useAppContext();
  const [license] = useState<any>()
  const [licenseKey, setLicenseKey] = useState<string>(license?.key || "");
  const [isActivatingLoading, setIsActivatingLoading] = useState(false);

  async function activateLicense() {
    try {
      if (!licenseKey) {
        webflow.notify({
          type: "Error",
          message: "Please enter valid license key",
        });
        return;
      }
      setIsActivatingLoading(true);

      const license = await AdminService.activateLicense(licenseKey);
      setIsActivatingLoading(false);
      console.log("license", license);
      if (license) {
        const vallidatedLicense = {
          siteId: license.siteId,
          appName: license.appName,
          expireAt: license.expireAt,
          createdAt: license.createdAt,
          valid: license.activated ? 1 : 0,
          key: license.key,
        };
        onActivate(vallidatedLicense);
      } else {
        console.log("License was not activated");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className={"mb-1 mt-1 text-[14px] font-bold"}>Enter your license key</p>
        <p className={"mb-1 w-full max-w-[607px] text-[12px] text-[#FFFFFFCC]"}>
          Enter the license key you obtained from FlowAppz here.{" "}
          <p className="mb-4 text-[0.71rem] text-[#A3A3A3]">
            <a
              href={`${import.meta.env.VITE_ADMIN_API_BASE_URL}/dashboard/products/social-share/licenses`}
              className="inline-flex items-center underline"
              target={"_blank"}
            >
              Check your available license keys
              <RightArrowMoveUpIcon />
            </a>
          </p>
        </p>

        <div className="w-full max-w-[304px]">
          <input
            className="input-inner-shadow w-full rounded-[4px] border-[1px] border-[#ffffff24] bg-[#00000015] p-1 px-[0.3rem] text-[0.7rem] leading-[1.1rem] text-[#f5f5f5] shadow-xl placeholder:text-[#ffffff66] focus:outline-none"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            readOnly={license?.valid === 1}
          />
        </div>
        <button
          onClick={activateLicense}
          className="boxShadows-action-colored mt-4 w-fit rounded-[6px] border-[1px] border-[#363636] bg-[#006ACC] px-[10px] py-[7px] text-center text-[12px] font-semibold"
          disabled={license?.valid === 1 || isActivatingLoading}
        >
          {isActivatingLoading ? "Loading..." : "Activate license"}
        </button>
      </div>
    </div>
  );
}
