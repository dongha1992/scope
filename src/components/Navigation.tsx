import { getZIndex } from "@/utils/getZIndex";
import {
  HomeActiveIcon,
  HomeUnActiveIcon,
  MypageActiveIcon,
  MypageUnActiveIcon,
} from "@/utils/svg";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const NAVIGATION = [
  {
    id: 0,
    name: "home",
    active: <HomeActiveIcon />,
    unactive: <HomeUnActiveIcon />,
    link: "/",
  },
  {
    id: 1,
    name: "book",
    active: <HomeActiveIcon />,
    unactive: <HomeUnActiveIcon />,
    link: "/book",
  },
  {
    id: 2,
    name: "mypage",
    active: <MypageActiveIcon />,
    unactive: <MypageUnActiveIcon />,
    link: "/mypage",
  },
];

function Navigation() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("/");

  useEffect(() => {
    const queryString = router.asPath;
    setSelectedTab(queryString);
  }, [router]);

  return (
    <div
      className="max-w-[540px] fixed bottom-0 right-0 mx-auto left-0 flex justify-center text-black w-100"
      style={{ zIndex: getZIndex("fixedBottom") }}
    >
      <div className="h-12 bg-white flex justify-between w-full px-10">
        {NAVIGATION.map((item, index) => {
          return (
            <div
              role="button"
              aria-label="클릭하면 메뉴 이동합니다."
              key={index}
              className="mt-3"
              onClick={() => router.push(item.link)}
            >
              {selectedTab === item.link ? item.active : item.unactive}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Navigation;
