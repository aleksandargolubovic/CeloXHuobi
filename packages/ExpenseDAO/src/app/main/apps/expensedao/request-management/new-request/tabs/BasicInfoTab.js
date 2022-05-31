import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FuseUtils from '@fuse/utils';
import Tesseract from 'tesseract.js';
import LoadingButton from '@mui/lab/LoadingButton';

import clsx from 'clsx';

import { useFormContext, Controller } from 'react-hook-form';


const Root = styled('div')(({ theme }) => ({
  '& .productImageFeaturedStar': {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0,
  },

  '& .productImageUpload': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  '& .productImageItem': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& .productImageFeaturedStar': {
        opacity: 0.8,
      },
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& .productImageFeaturedStar': {
        opacity: 1,
      },
      '&:hover .productImageFeaturedStar': {
        opacity: 1,
      },
    },
  },
}));


function BasicInfoTab(props) {
  const [loadingAmount, setLoadingAmount] = useState(false);

  const methods = useFormContext();
  const { control, formState, watch, register, setValue } = methods;
  const image = watch('image', "");

  const categories = [
    "Equipment", "Home Office", "Meals and Entertainment", "Office Supplies", "Travel", "Other"
  ];

  return (
    <div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">receipt_long</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Receipt
          </Typography>
        </div>

        <div className="mb-24">
          <Root>
            <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
              <Controller
                name="image"
                defaultValue=""
                control={control}
                render={({ field: { onChange, value } }) => (
                  value == "" ?
                    <label
                      htmlFor="button-file"
                      className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                    >
                      <input
                        accept="image/*"
                        className="hidden"
                        id="button-file"
                        type="file"
                        onChange={async (e) => {
                          function readFileAsync() {
                            return new Promise((resolve, reject) => {
                              const file = e.target.files[0];
                              if (!file) {
                                return;
                              }
                              const reader = new FileReader();

                              reader.onload = (loadEvt) => {
                                resolve({
                                  id: FuseUtils.generateGUID(),
                                  url: `data:${file.type};base64,${btoa(reader.result)}`,
                                  type: 'image',
                                  file: file,
                                  ipfsUrl: '',
                                });
                              };

                              reader.onerror = reject;

                              reader.readAsBinaryString(file);
                            });
                          }

                          const newImage = await readFileAsync();
                          onChange(newImage);
                          setLoadingAmount(true);
                          let src = await new Promise(resolve => {
                            const reader = new FileReader();
                            reader.readAsDataURL(newImage.file);
                            reader.onload = () => resolve(reader.result);
                          });
                          Tesseract.recognize(
                            src,
                            'eng',
                            { logger: m => console.log(m) }
                          ).then(({ data: { text } }) => {
                            console.log(text);
                            let totalPosition = text.indexOf("Total") + 6;
                            let amount = text.substring(totalPosition, text.indexOf("\n", totalPosition));
                            console.log(amount);
                            setValue('amount', amount)
                            setLoadingAmount(false);
                          })
                        }}
                      />
                      <Icon fontSize="large" color="action">
                        cloud_upload
                      </Icon>
                    </label>
                    :
                    <div
                      role="button"
                      tabIndex={0}
                      className={clsx(
                        'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg',
                      )}
                    >
                      <div className="productImageFeaturedStar"
                        onClick={() => onChange('')}
                      >
                        <Icon >delete</Icon>
                      </div>
                      <img className="max-w-none w-auto h-full" src={image.url} alt="product" />
                    </div>
                )}
              />
            </div>
          </Root>
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">attach_money</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Amount
          </Typography>
          {loadingAmount && <LoadingButton loading={true} disabled={true}></LoadingButton>}
        </div>

        <div className="mb-24">

          <Controller
            name="amount"
            defaultValue=''
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-8 mb-16"
                required
                id="amount"
                label="Amount"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">category</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Category
          </Typography>
        </div>
        <div className="mb-24">
          <Controller
            name="category"
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                fullWidth
                required
                select
                label="Choose Category"
                id="category"
                variant="outlined"
                {...field}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">description</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Description
          </Typography>
        </div>
        <div className="mb-24">
          <Controller
            name="description"
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-8 mb-16"
                label="Description"
                id="description"
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                type="text"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default BasicInfoTab;