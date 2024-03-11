// third party libraries
import { FormControl, Grid, Typography } from "@mui/material";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../ProfileInformation";

// ==============================|| Pickup Location COMPONENT ||============================== //
const PickUpLocation = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  editMode,
}: any) => {
  return (
    <PageSection id="field3">
      <Typography variant="h4">Alternate Pickup Location</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.pickUpLocationName && errors.pickUpLocationName
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationName">Name</InputFormLabel>
            <CustomTextField
              id="pickUpLocationName"
              type="text"
              value={values.pickUpLocationName}
              name="pickUpLocationName"
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
              touched.pickUpLocationAddress && errors.pickUpLocationAddress
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationAddress">
              Address
            </InputFormLabel>
            <CustomTextField
              id="pickUpLocationAddress"
              type="text"
              value={values.pickUpLocationAddress}
              name="pickUpLocationAddress"
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
              touched.pickUpLocationUnit && errors.pickUpLocationUnit
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationUnit">
              Apartment/Unit
            </InputFormLabel>
            <CustomTextField
              id="pickUpLocationUnit"
              type="text"
              value={values.pickUpLocationUnit}
              name="pickUpLocationUnit"
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
              touched.pickUpLocationCity && errors.pickUpLocationCity
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationCity">City</InputFormLabel>
            <CustomTextField
              id="pickUpLocationCity"
              type="text"
              value={values.pickUpLocationCity}
              name="pickUpLocationCity"
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

export default PickUpLocation;
