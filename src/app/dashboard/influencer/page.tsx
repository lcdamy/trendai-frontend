"use client";
import React from "react";
import { CampaignFetchData, ContentFormData, ContentFormValidationErrors, SocialMedia } from "@/@types/global";
import { IconButton, MenuItem, Snackbar, SnackbarCloseReason, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/Button";
import CampaignComponent from "@/components/Campaign";
import { State } from "@/app/register/page";

const env = process.env.NEXT_PUBLIC_TRENDAI_API

const socialMedias = [
    {
        value: 'Instagram',
        label: 'Instagram'
    },
    {
        value: 'Tiktok',
        label: 'Tiktok'
    },

]
const InfluencerPage = () => {
    const [showCreateCampaign, setShowCreateCampaign] = React.useState(false);
    const [campaigns, setCampaigns] = React.useState([]);

    const [state, setState] = React.useState<State>({
        open: false,
        vertical: "top",
        horizontal: "center",
    });

    const [message, setmessage] = React.useState("");

    const { open, vertical, horizontal } = state;

    const [reload, setReload] = React.useState(true);

    const handleShowCreateCampaign = () => setShowCreateCampaign(!showCreateCampaign);

    const [formData, setFormData] = React.useState<ContentFormData>({
        link: '',
        social: '' as SocialMedia,
    });
    const [errors, setErrors] = React.useState<ContentFormValidationErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors: ContentFormValidationErrors = {};

        if (!formData.link.trim()) {
            newErrors.link = 'Link is required';
        } else if (formData.link.length < 2) {
            newErrors.link = 'Name must be at least 2 characters';
        }



        if (!formData.social) {
            newErrors.social = 'Please select a user type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {

        const token = localStorage.getItem("jwt_token");

        if (validateForm()) {
            // Proceed with form submission

            const response = await fetch(`${env}/influencer`, {
                method: "POST",
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                 },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                setState({ ...state, open: true });
                setmessage(data.message);
            } else {
                handleClearForm()
            }

        }
    };

    const handleClearForm = () => {
        setFormData({
            link: '',
            social: '' as SocialMedia,
        });
        setErrors({});
        handleShowCreateCampaign();
    };

    React.useEffect(() => {
        const token: string | null = localStorage.getItem("jwt_token");
        fetchData(token);
    }, [reload]);

    const fetchData = async (token: string | null) => {
        const campaign_api = `${env}/campaign/influencer`;
        const response = await fetch(campaign_api, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (response.ok) {
            setCampaigns(data);
            setReload(false)
        }
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setState({ ...state, open: false });
    };

    const setRefetch = async () => {
        return setReload(true);
    }

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div className='flex w-5/6 flex-col gap-8 items-center justify-center'>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
                key={vertical + horizontal}
            />

            <header className="text-center font-semibold">Campaigns</header>

            {!showCreateCampaign && (<div className="flex w-full flex-col gap-8 items-center justify-center">

                {campaigns && campaigns.map((c: CampaignFetchData) => (
                    <CampaignComponent
                        title={c.title}
                        description={c.desc}
                        startDate={c.start_date}
                        endDate={c.end_date}
                        image={c.image}
                        link={`/dashboard/brand/${c._id}`}
                        hasActions={true}
                        key={c._id}
                        handleShowCreateCampaign={handleShowCreateCampaign}
                        id={c._id}
                        status={c.status}
                        setRefetch={setRefetch}
                    />
                ))}

            </div>)}

            {showCreateCampaign && (
                <form noValidate autoComplete="off" className='flex flex-col gap-4 p-4 max-w-[500px] mx-auto w-full'>
                    <header className='text-center font-semibold text-xl'>Submit Content</header>

                    <TextField
                        helperText={errors.link || ""}
                        error={!!errors.link}
                        label="Link"
                        variant="outlined"
                        type='text'
                        name="link"
                        value={formData.link}
                        required
                        onChange={handleChange}
                    />

                    <TextField
                        helperText={errors.social || ""}
                        error={!!errors.social}
                        label="Social Media"
                        variant='outlined'
                        select
                        name="social"
                        value={formData.social}
                        onChange={handleChange}
                    >
                        {socialMedias.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button text="Save" type="button" className="bg-[#89e81d] rounded-md p-2 h-12" onClick={handleSubmit} />
                    <Button text="Back" type="button" className="bg-white border  rounded-md p-2 h-12" onClick={handleClearForm} />

                </form>
            )}
        </div>)
}
export default InfluencerPage;