"use client";
import * as React from "react";
import { CampaignComponentProps } from "@/@types/global";
import Image from "next/image";
import { Typography } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";

const env = process.env.NEXT_PUBLIC_TRENDAI_API

const CampaignComponent: React.FC<CampaignComponentProps> = ({
  title,
  description,
  startDate,
  endDate,
  image,
  link,
  hasActions,
  handleShowCreateCampaign,
  status,
  id,
  setRefetch
}) => {


  const [formData, setFormData] = React.useState({
    email: ""
  })

  React.useEffect(() => {
    const token: string | null = localStorage.getItem("jwt_token");
    fetchData(token);
  }, []);

  const fetchData = async (token: string | null) => {
    const profile_api = `${env}/auth/profile`;
    const response = await fetch(profile_api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      setFormData({  email: data.email });
    }
  };

  const handleJoin = async () => {

    const token = localStorage.getItem("jwt_token");

    const response = await fetch(`${env}/campaign/join/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log("data", data)

    if (response.ok && setRefetch) {
      setRefetch();
    }
  };
  return (
    <div className="flex flex-col gap-4 p-2 border rounded-md w-5/6">
      <div className="flex gap-8">
        <Image
          aria-hidden
          src={image}
          alt="Globe icon"
          width={200}
          height={200}
          priority
        />
        <div className="flex flex-col gap-8">
          <header className="flex gap-8 flex-col flex-1">
            <Typography variant="h6">{title}</Typography>
            <div className="flex gap-8">
              <Typography
                variant="subtitle1"
                className="px-2 border border-[#89e81d] rounded-md"
              >
                Started date: {dayjs(startDate).format("YYYY-MM-DD")}
              </Typography>
              <Typography
                variant="subtitle1"
                className="px-2 border border-[#89e81d] rounded-md"
              >
                End date: {dayjs(endDate).format("YYYY-MM-DD")}
              </Typography>
            </div>
          </header>
          <p>{description}</p>

          {!hasActions && (
            <Link href={link}>
              <Typography
                variant="subtitle1"
                className="w-fit cursor-pointer hover:underline bg-black text-white py-2 px-4 rounded-full"
              >
                Visit Campaign
              </Typography>
            </Link>
          )}

          {hasActions && (
            <div className="flex gap-4">
              {status && status.toLowerCase() === "pending" && (<button
                type="button"
                className="bg-[#c4c4c4] rounded-full text-sm py-2 px-4"
                onClick={handleJoin}
              >
                Join Campaign
              </button>)}

              {status && status.toLowerCase() === "approved" && (<button
                type="button"
                className="bg-white border rounded-full text-sm py-2 px-4"
                onClick={handleShowCreateCampaign}
              >
                Submit Content
              </button>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignComponent;
