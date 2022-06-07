import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import { useFormContext, Controller } from 'react-hook-form';

const currencies = [
  "cUSD", "cEUR"
];

function readCSVFileAsync(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = (loadEvt) => {
      const text = loadEvt.target.result;
      resolve(text.slice(text.indexOf("\n") + 1).split(/\r\n|\n/));
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
}

function BasicInfoTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.name}
            required
            helperText={errors?.name?.message}
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="approvers"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <>
            <Autocomplete
              className="mt-8 mb-16"
              multiple
              freeSolo
              options={[]}
              value={value}
              onChange={(event, newValue) => {
                onChange(newValue);
                if (newValue.length === 0)
                  document.getElementById("csvFileInputApprovers").value = "";
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add approvers"
                  required
                  label="Approvers"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <input
              className="flex flex-1 mx-8"
              type="file"
              id="csvFileInputApprovers"
              accept=".csv"
              onChange={async (e) => {
                const approversList = await readCSVFileAsync(e.target.files[0]);
                onChange(approversList.slice(0, -1));
              }}
            />
            <br />
          </>
        )}
      />

      <Controller
        name="members"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <>
            <Autocomplete
              className="mt-8 mb-16"
              multiple
              freeSolo
              options={[]}
              value={value}
              onChange={(event, newValue) => {
                onChange(newValue);
                if (newValue.length === 0)
                  document.getElementById("csvFileInputMembers").value = "";
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add members"
                  required
                  label="Members"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <input
              className="flex flex-1 mx-8"
              type="file"
              id="csvFileInputMembers"
              accept=".csv"
              onChange={async (e) => {
                const approversList = await readCSVFileAsync(e.target.files[0]);
                onChange(approversList.slice(0, -1));
              }}
            />
            <br />
          </>
        )}
      />

      <Controller
        name="currency"
        control={control}
        defaultValue=''
        render={({ field }) => (
          <TextField
            fullWidth
            required
            select
            label="Choose Currency"
            id="currency"
            variant="outlined"
            {...field}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
