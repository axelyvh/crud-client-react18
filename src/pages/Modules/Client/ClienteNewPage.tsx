import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  Grid,
  TextField,
  Avatar,
  Box,
  styled,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledLabel = styled("label")({
  display: "block",
  marginBottom: "8px",
});

interface FormDataClient {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthdate: string;
  cvFile?: FileList;
  profilePicture?: FileList;
}

const ClientNewPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    //setValue,
    formState: { errors },
  } = useForm<FormDataClient>();
  const navigate = useNavigate();

  // const [profilePicturePreview, setProfilePicturePreview] = useState<
  //   string | null
  // >(null);

  // const handleProfilePictureChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         setProfilePicturePreview(reader.result);
  //       }
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //     setValue("profilePicture", event.target.files);
  //   }
  // };

  const onSubmit = async (data: FormDataClient) => {

    try {
console.log(data);
      if (data.cvFile == null || data.cvFile?.length === 0){
        alert("Por favor adjunte su CV");
        return false;
      }

      if (data.profilePicture == null || data.profilePicture?.length === 0){
        alert("Por favor adjunte su foto de perfil");
        return false;
      }

      const formDataCV = new FormData();
      formDataCV.append('files', data.cvFile[0]);
      let resultCV = await axios.post('https://localhost:7117/api/Attachment/cv', formDataCV);
      console.log(resultCV);
      let cv_guid = resultCV.data[0].id;

      const formDataProfile = new FormData();
      formDataProfile.append('files', data.profilePicture[0]);
      let resultProfile = await axios.post('https://localhost:7117/api/Attachment/profile', formDataProfile);
      let profile_guid = resultProfile.data[0].id;

      let obj = {
        "name": data.firstName,
        "lastname": data.lastName,
        "birthDate": data.birthdate,
        "documentType": data.documentType,
        "documentNumber": data.documentNumber,
        "attachmentCV": cv_guid,
        "attachmentProfile": profile_guid
      };
      let resultCreate = await axios.post('https://localhost:7117/api/Client/Create', obj);
      console.log(resultCreate);
      if(resultCreate.status !== 200){
        if(resultCreate.status === 400){
          alert(resultCreate.data.Message);
          return false;
        } else {
          alert("Ocurrio un error interno del servidor");
          return false;
        }
      }



      //   const formData = new FormData();
      //   formData.append('firstName', data.firstName);
      //   formData.append('lastName', data.lastName);
      //   formData.append('birthdate', data.birthdate);
      //   if (data.cvFile) {
      //     formData.append('cvFile', data.cvFile[0]);
      //   }
      //   if (data.profilePicture) {
      //     formData.append('profilePicture', data.profilePicture[0]);
      //   }

      //   // Aquí puedes enviar los datos del formulario al servidor
      //   await axios.post('URL_DEL_ENDPOINT', formData);

      //   // Limpia los campos del formulario después de enviar los datos
      //   setValue('firstName', '');
      //   setValue('lastName', '');
      //   setValue('birthdate', '');
      //   setValue('cvFile', undefined);
      //   setValue('profilePicture', undefined);
      //   setProfilePicturePreview(null);

      navigate("/");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <br></br>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("firstName", { required: true })}
            label="Nombres"
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName ? "Este campo es requerido" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("lastName", { required: true })}
            label="Apellidos"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName ? "Este campo es requerido" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("documentType", { required: true })}
            select
            label="Tipo de Documento"
            fullWidth
            error={!!errors.documentType}
            helperText={errors.documentType ? "Este campo es requerido" : ""}
          >
            <MenuItem value="DNI">DNI</MenuItem>
            <MenuItem value="RUC">RUC</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("documentNumber", { required: true })}
            label="Nro. de Documento"
            fullWidth
            error={!!errors.documentNumber}
            helperText={errors.documentNumber ? "Este campo es requerido" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("birthdate", { required: true })}
            label="Fecha de Nacimiento"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.birthdate}
            helperText={errors.birthdate ? "Este campo es requerido" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledLabel htmlFor="cv-file">Subir CV</StyledLabel>
          <input
            {...register("cvFile")}
            type="file"
            id="cv-file"
            accept=".pdf"
          />
        </Grid>
        <Grid item xs={12}>
          <StyledLabel htmlFor="profile-picture">
            Subir Foto de Perfil
          </StyledLabel>
          <Box display="flex" alignItems="center">
            <input
              {...register("profilePicture")}
              type="file"
              id="profile-picture"
              accept="image/*"
              // onChange={handleProfilePictureChange}
            />
            {/* {profilePicturePreview && (
              <Avatar
                src={profilePicturePreview}
                alt="Profile Picture Preview"
                sx={{ width: 100, height: 100, marginLeft: 2 }}
              />
            )} */}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ClientNewPage;
