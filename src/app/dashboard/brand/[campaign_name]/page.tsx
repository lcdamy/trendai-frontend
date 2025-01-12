"use client";
import React, { useEffect } from "react";
import { Box, Drawer, Tab, Tabs, Typography } from "@mui/material";
import Image from "next/image";
import TableComponent from "@/components/Table";
import { campaignTypes, influencerTypes, TabPanelProps } from "@/@types/global";
import { useRouter, usePathname } from "next/navigation";
import dayjs from "dayjs";

const env = process.env.NEXT_PUBLIC_TRENDAI_API

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

type Anchor = "right";

const BrandCampaignsPage = () => {
  const [state, setState] = React.useState({
    right: false,
  });

  const router = useRouter();

  const searchParams = usePathname();

  const [value, setValue] = React.useState(0);

  const [campaign, setcampaign] = React.useState<campaignTypes>({
    _id: "",
    start_date: "",
    end_date: "",
    image: "./../../globe.svg",
    desc: "",
    title: "",
  });

  const [influencers, setInfluencers] = React.useState<influencerTypes[]>([]);
  const [rows, setRows] = React.useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("newValue", newValue);

    setValue(newValue);
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  useEffect(() => {
    const my_array = searchParams.split("/");
    const id: string = my_array[my_array.length - 1];

    const token: string | null = localStorage.getItem("jwt_token");
    fetchData(token, id);
  }, [searchParams]);

  const handleRefect = async (email: string) => {
    const token: string | null = localStorage.getItem("jwt_token");
    await fetchInfluencerContent(token, email);
  }

  useEffect(() => {
    if (influencers.length > 0) {
      const token: string | null = localStorage.getItem("jwt_token");
      const firstEmail = influencers[0].email;

      fetchInfluencerContent(token, firstEmail);
    }
  }, [influencers]);

  const fetchData = async (token: string | null, id: string) => {
    const read_campaign_api = `${env}/campaign/${id}`;
    const response = await fetch(read_campaign_api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      setcampaign(data);
      setInfluencers(data.influencers)
    }
  };

  const fetchInfluencerContent = async (token: string | null, email: string) => {

    const contentAPI = `${env}/influencer/content/${email}`;
    const response = await fetch(contentAPI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      setRows(data);
    }
  };

  return (
    <div className="flex w-full flex-col my-16 items-center justify-center">
      <div className="flex flex-col gap-4 p-2 border rounded-md w-5/6">
        <div className="flex flex-col gap-8">
          <header className="font-semibold text-xl">
            {campaign.title ?? "No Title"}
          </header>
          <Image
            aria-hidden
            src={campaign.image}
            alt="Globe icon"
            width={500}
            height={300}
            priority
          />
          <div className="flex flex-col gap-8">
            <div className="flex gap-8">
              <Typography
                variant="subtitle1"
                className="px-2 border border-[#89e81d] rounded-md"
              >
                Started date: {dayjs(campaign.start_date).format("YYYY-MM-DD")}
              </Typography>
              <Typography
                variant="subtitle1"
                className="px-2 border border-[#89e81d] rounded-md"
              >
                End date: {dayjs(campaign.end_date).format("YYYY-MM-DD")}
              </Typography>
            </div>
            <p>{campaign.desc}</p>
            <div className="flex gap-8">
              <Typography
                variant="subtitle1"
                className="w-fit cursor-pointer hover:underline bg-black text-white py-2 px-4 rounded-full"
                onClick={() => router.back()}
              >
                Back
              </Typography>
              <Typography
                variant="subtitle1"
                className="w-fit cursor-pointer hover:underline bg-black text-white py-2 px-4 rounded-full"
                onClick={toggleDrawer("right", true)}
              >
                View Campaign
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className="p-4">
              <Box className="w-full ">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  {influencers && influencers.map((i: influencerTypes, index) => (<Tab key={index} value={index} label={i.email} onClick={() => handleRefect(i.email)} />))}
                </Tabs>

                {influencers && influencers.map((i, index) => (<TabPanel key={index} value={value} index={index}>
                  <TableComponent rows={rows} />
                </TabPanel>))}

              </Box>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BrandCampaignsPage;
