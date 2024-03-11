// third party libraries
import { FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import { Field } from "formik";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../ProfileInformation";
import { DatePicker } from "@/components/CustomInput";

// ==============================|| PERMIT INFO COMPONENT ||============================== //
const PermitInfo = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  editMode,
}: any) => {
  return (
    <PageSection id="field4">
      <Typography variant="h4">Permit Info</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.permitNumber && errors.permitNumber)}
            size="small"
          >
            <InputFormLabel htmlFor="permitNumber">
              Permit Number
            </InputFormLabel>
            <CustomTextField
              id="permitNumber"
              type="text"
              value={values.permitNumber}
              name="permitNumber"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6} />

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputFormLabel id="permitDateIssued">
              Permit Date Issued
            </InputFormLabel>
            <DatePicker name="permitDateIssued" />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputFormLabel id="permitExpDate">
              Permit Expiration Date
            </InputFormLabel>
            <DatePicker name="permitExpDate" />
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
            <InputFormLabel id="permit-endorsed-by">
              Permit Endorsed by
            </InputFormLabel>

            <Field
              fullWidth
              id="permit-endorsed-by"
              name="permitEndorsedBy"
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
          <FormControl>
            <InputFormLabel id="permit-endorsed-date">
              Permit Endorsed Date
            </InputFormLabel>
            <DatePicker name="permitEndorsedDate" disabled={!editMode} />
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default PermitInfo;
