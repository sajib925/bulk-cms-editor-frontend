import { type ReactNode } from 'react'

type Tab = {
  menuItem: string
  render: () => JSX.Element
  icon?: ReactNode
}

type TabsProps = {
  tabs: Tab[]
  children?: ReactNode
  activeTab: number
  setActiveTab: (tab: number) => void
  isSticky?: boolean
}
export const Tabs = ({ tabs, children, activeTab, setActiveTab, isSticky = false }: TabsProps) => {
  return (
    <>
      <div
        className={`${isSticky ? 'sticky top-0 left-0 w-full bg-[#1e1e1e]' : ''} flex items-center gap-6 border-b-[1.25px] border-b-[#363636] px-[18px]`}
        tabIndex={0}
      >
        {tabs.map((menu: Tab, index: number) => {
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`${activeTab === index ? 'text-[#006ACC] border-[#006ACC]' : 'text-[#FFFFFFCC] border-transparent'} border-b-[2px] text-[14px] font-semibold py-3 flex items-center gap-2`}
            >
              {menu.icon}
              <span>{menu.menuItem}</span>
            </button>
          )
        })}
      </div>
      {children ? <div className="px-[18px] pt-[18px]"> {children}</div> : ''}
      <div className={'h-[calc(100vh-45px)] overflow-hidden'}>{tabs[activeTab].render()}</div>
    </>
  )
}
