// third party libraries
import {
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Field } from "formik";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../ProfileInformation";

// ==============================|| CONTACT INFORMATION COMPONENT ||============================== //
const ContactInformation = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  editMode,
}: any) => {
  return (
    <PageSection id="field2">
      <Typography variant="h4">1st Emergency Contact Information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.contactName && errors.contactName)}
            size="small"
          >
            <InputFormLabel htmlFor="contactName">Contact Name</InputFormLabel>
            <CustomTextField
              id="contactName"
              type="text"
              value={values.contactName}
              name="contactName"
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
            <InputFormLabel id="contact-relation">
              Contact Relation
            </InputFormLabel>

            <Field
              fullWidth
              id="contact-relation"
              name="contactRelation"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              <MenuItem value={"Father"}>Father</MenuItem>
              <MenuItem value={"Mother"}>Mother</MenuItem>
            </Field>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.contactEmail && errors.contactEmail)}
            size="small"
          >
            <InputFormLabel htmlFor="contactEmail">
              Contact Email
            </InputFormLabel>
            <CustomTextField
              id="contactEmail"
              type="email"
              value={values.contactEmail}
              name="contactEmail"
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
            error={Boolean(touched.contactPhone && errors.contactPhone)}
            size="small"
          >
            <InputFormLabel htmlFor="contactPhone">
              Contact Cell Phone
            </InputFormLabel>
            <CustomTextField
              id="contactPhone"
              type="text"
              value={values.contactPhone}
              name="contactPhone"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Divider
        sx={{
          margin: "30px 0",
        }}
      />

      <Typography variant="h4">2nd Emergency Contact Information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.secondContactName && errors.secondContactName
            )}
            size="small"
          >
            <InputFormLabel htmlFor="secondContactName">
              Contact Name
            </InputFormLabel>
            <CustomTextField
              id="secondContactName"
              type="text"
              value={values.secondContactName}
              name="secondContactName"
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
            <InputFormLabel id="secondContactRelation">
              Contact Relation
            </InputFormLabel>

            <Field
              fullWidth
              id="secondContactRelation"
              name="secondContactRelation"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              <MenuItem value={"Father"}>Father</MenuItem>
              <MenuItem value={"Mother"}>Mother</MenuItem>
            </Field>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.secondContactEmail && errors.secondContactEmail
            )}
            size="small"
          >
            <InputFormLabel htmlFor="secondContactEmail">
              Contact Email
            </InputFormLabel>
            <CustomTextField
              id="secondContactEmail"
              type="email"
              value={values.secondContactEmail}
              name="secondContactEmail"
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
            error={Boolean(
              touched.secondContactPhone && errors.secondContactPhone
            )}
            size="small"
          >
            <InputFormLabel htmlFor="secondContactPhone">
              Contact Cell Phone
            </InputFormLabel>
            <CustomTextField
              id="secondContactPhone"
              type="text"
              value={values.secondContactPhone}
              name="secondContactPhone"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default ContactInformation;
