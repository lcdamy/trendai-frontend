"use client";
import * as React from "react";
import {
  Fab,
  TextField,
  Button as ButtonMUI,
  styled,
  SnackbarCloseReason,
  IconButton,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/Button";
import DatePickerComponent from "@/components/DatePicker";
import {
  CampaignFetchData,
  CampaignFormData,
  CampaignValidationErrors,
} from "@/@types/global";
import CampaignComponent from "@/components/Campaign";
import { useEffect } from "react";
import { State } from "@/app/register/page";
import SyncIcon from '@mui/icons-material/Sync';


const env = process.env.NEXT_PUBLIC_TRENDAI_API

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DashboardPage = () => {
  const [reload, setreload] = React.useState(true);

  const [campaign, setcampaign] = React.useState([]);

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [message, setmessage] = React.useState("");

  const { open, vertical, horizontal } = state;

  useEffect(() => {
    const token: string | null = localStorage.getItem("jwt_token");
    fetchData(token);
  }, [reload]);

  const [formData, setFormData] = React.useState<CampaignFormData>({
    title: "",
    image: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = React.useState<CampaignValidationErrors>({});

  const [showCreateCampaign, setShowCreateCampaign] = React.useState(false);

  const handleShowCreateCampaign = () =>
    setShowCreateCampaign(!showCreateCampaign);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image" && e.target.files) {
      const file = e.target.files[0];

      if (file) {
        // Check file type (e.g., image/jpeg, image/png)
        if (!file.type.startsWith("image/")) {
          console.log("Please upload an image file");
          return;
        }

        // Check file size (e.g., 5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          console.log("File size exceeds 5MB limit");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          [e.target.name]: file,
        }));
      }
    } else {
      // Handle other input changes
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: CampaignValidationErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Create a FormData object to handle file uploads
    const formDataObj = new FormData();

    // Append the file
    if (formData.image) {
      formDataObj.append("file", formData.image);
    }

    // Append other form data as JSON string
    const campaignData = {
      title: formData.title,
      desc: formData.description,
      status: "Pending",
      start_date: formData.startDate,
      end_date: formData.endDate,
    };
    formDataObj.append("data", JSON.stringify(campaignData));

    if (validateForm()) {
      try {
        const add_campaign_api = `${env}/campaign`;
        const token = localStorage.getItem("jwt_token");

        const response = await fetch(add_campaign_api, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Remove Content-Type header - let browser set it automatically with boundary
          },
          body: formDataObj,
        });

        const data = await response.json();

        if (!response.ok) {
          setState({ ...state, open: true });
          setmessage(data.message);
          return;
        }
        handleClearForm();
        handleShowCreateCampaign();
        setreload(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        setState({ ...state, open: true });
        setmessage("An error occurred while submitting the form");
      }
    } else {
      console.log("Form has errors", errors);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: "",
      image: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    setErrors({});
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

  const fetchData = async (token: string | null) => {
    const campaign_api = `${env}/campaign/brand`;
    const response = await fetch(campaign_api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      setcampaign(data);
      setreload(false);
    }
  };

  if(reload){
    return (
      <SyncIcon fontSize="large" className="animate-spin" />
    )
  }

  return (
    <div className="w-full flex items-center justify-center flex-col gap-8">
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

      {!showCreateCampaign && (
        <div className="flex w-full flex-col gap-8 items-center justify-center">
          {campaign.map((c: CampaignFetchData) => (
            <CampaignComponent
              title={c.title ?? "No campaign title rn"}
              description={c.desc}
              startDate={c.start_date}
              endDate={c.end_date}
              image={c.image}
              link={`/dashboard/brand/${c._id}`}
              hasActions={false}
              key={c._id}
            />
          ))}
        </div>
      )}

      {showCreateCampaign && (
        <div className="flex w-5/6 flex-col gap-8 items-center justify-center">
          <form
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 p-4 max-w-[500px] mx-auto w-full"
          >
            <header className="text-center font-semibold text-xl">
              Create new campaign
            </header>

            <TextField
              helperText={errors.title || ""}
              error={!!errors.title}
              label="Title"
              variant="outlined"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <ButtonMUI
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className="border !border-[#c4c4c4] h-14 bg-white hover:bg-[#f5f5f5] rounded-md !text-black/50 hover:text-[#89e81d]"
              color={errors.image ? "error" : "primary"}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                name="image"
                onChange={handleChange}
                multiple
              />
            </ButtonMUI>
            <small className="text-[#d3302f]">{errors.image}</small>

            <TextField
              helperText={errors.description || ""}
              error={!!errors.description}
              label="Description"
              variant="outlined"
              type="text"
              name="description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />

            <div className="flex gap-2">
              <div className="flex flex-col">
                <DatePickerComponent
                  formData={formData}
                  setFormData={setFormData}
                  fieldName="startDate"
                />
                <small className="text-[#d3302f]">{errors.startDate}</small>
              </div>
              <div>
                <DatePickerComponent
                  formData={formData}
                  setFormData={setFormData}
                  fieldName="endDate"
                />
                <small className="text-[#d3302f]">{errors.endDate}</small>
              </div>
            </div>

            <Button
              text="Save"
              type="button"
              className="bg-[#89e81d] rounded-md p-2 h-12"
              onClick={handleSubmit}
            />
            <Button
              text="Clear"
              type="button"
              className="bg-white border  rounded-md p-2 h-12"
              onClick={handleClearForm}
            />
          </form>
        </div>
      )}

      <div className="flex p-4">
        <Fab
          variant="extended"
          sx={{
            textTransform: "capitalize",
            width: "fit-content",
            backgroundColor: "#ffffff",
          }}
          onClick={handleShowCreateCampaign}
        >
          <AddIcon
            sx={{ mr: 1 }}
            className={` ${showCreateCampaign && "rotate-45"}`}
          />
          {showCreateCampaign ? " Close Form " : "Create new campaign"}
        </Fab>
      </div>
    </div>
  );
};

export default DashboardPage;
