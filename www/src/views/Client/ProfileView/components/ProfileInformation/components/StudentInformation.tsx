import React from "react";

// third party libraries
import {
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import moment from "moment";
import { Field } from "formik";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../ProfileInformation";
import { DatePicker } from "@/components/CustomInput";
import AddressAutoComplete from "@/components/AddressAutoComplete";

/**
 * Capitalizes the first letter of a given string.
 * @param {String} string - The input string to capitalize.
 * @returns {String} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(string: String) {
  return string[0].toUpperCase() + string.slice(1);
}

// ==============================|| STUDENT INFORMATION COMPONENT ||============================== //

const StudentInformation = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  editMode,
}: any) => {
  return (
    <PageSection id="field1">
      <Typography
        variant="h4"
        sx={{
          lineHeight: "32.5px",
          color: "#000000",
        }}
      >
        Student Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            variant="standard"
            fullWidth
            error={Boolean(touched.firstName && errors.firstName)}
          >
            <InputFormLabel htmlFor="firstName">First Name</InputFormLabel>
            <CustomTextField
              size="small"
              id="firstName"
              name="firstName"
              value={values?.firstName}
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.lastName && errors.lastName)}
          >
            <InputFormLabel htmlFor="last-name">Last Name</InputFormLabel>
            <CustomTextField
              id="last-name"
              type="text"
              className="lastName"
              value={values.lastName}
              name="lastName"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.notes && errors.notes)}
          >
            <InputFormLabel htmlFor="office-notes">Office Notes</InputFormLabel>
            <CustomTextField
              id="office-notes"
              type="text"
              value={values.notes}
              name="notes"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              multiline
              minRows={2}
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.address && errors.address)}
          >
            <InputFormLabel htmlFor="address">Address</InputFormLabel>
            {/* <CustomTextField
              id="address"
              type="text"
              value={values.address}
              name="address"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              multiline
              minRows={2}
              disabled={!editMode}
            /> */}
            <AddressAutoComplete
              inputValue={values?.address}
              setFieldValue={setFieldValue}
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.unit && errors.unit)}
          >
            <InputFormLabel htmlFor="unit">Apartment/Unit</InputFormLabel>
            <CustomTextField
              id="unit"
              type="text"
              value={values.unit}
              name="unit"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.city && errors.city)}
          >
            <InputFormLabel htmlFor="city">City</InputFormLabel>
            <CustomTextField
              id="city"
              type="text"
              value={values.city}
              name="city"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.state && errors.state)}
          >
            <InputFormLabel htmlFor="state">State</InputFormLabel>
            <CustomTextField
              id="state"
              type="text"
              value={values.state}
              name="state"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.zip && errors.zip)}
          >
            <InputFormLabel htmlFor="zip">Zip</InputFormLabel>
            <CustomTextField
              id="zip"
              type="text"
              value={values.zip}
              name="zip"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.phone && errors.phone)}
            size="small"
          >
            <InputFormLabel htmlFor="phone">Cell Phone</InputFormLabel>
            <CustomTextField
              id="phone"
              type="text"
              value={values.phone}
              name="phone"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputFormLabel id="gender-radio-group">Gender</InputFormLabel>
            <RadioGroup
              row
              aria-labelledby="gender-radio-group"
              name="gender"
              value={values?.gender}
              onChange={(event) =>
                setFieldValue(
                  "gender",
                  (event.target as HTMLInputElement).value
                )
              }
            >
              {["female", "male", "other"].map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item || "male"}
                  control={<Radio />}
                  label={capitalizeFirstLetter(item)}
                  disabled={!editMode}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputFormLabel id="birthDate">Birth Date</InputFormLabel>
            <DatePicker
              name="birthDate"
              value={moment(values?.birthDate)}
              onChange={(newValue: any) => {
                let formattedDate = moment(newValue).format("YYYY-MM-DD");

                setFieldValue("birthDate", formattedDate);
              }}
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            size="small"
            sx={{
              "& > div": {
                borderRadius: "50px",
                "&:hover": {
                  "&& fieldset": {
                    border: "2px solid #EAECEE",
                  },
                },
              },
            }}
          >
            <InputFormLabel id="school-list">School</InputFormLabel>

            <Field
              fullWidth
              id="school-list"
              name="school"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              {["School One", "School Two", "School Three"].map(
                (item, index) => (
                  <MenuItem value={index} key={item}>
                    {item}
                  </MenuItem>
                )
              )}
            </Field>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputFormLabel id="certificate-radio-btn-groups">
              Receive Certificates
            </InputFormLabel>

            <RadioGroup
              aria-labelledby="certificate-radio-btn-groups"
              name="receiveCertificate"
            >
              <FormControlLabel
                value="mail"
                control={<Radio />}
                label="Mail me my certificate."
                disabled={!editMode}
              />
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label="I will pickup my certificate personally."
                disabled={!editMode}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default StudentInformation;
