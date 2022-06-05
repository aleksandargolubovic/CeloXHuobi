import { useState, useCallback } from 'react';
import { useOnRepetition } from "./useOnRepetition";
import axios from "axios";

export const getPrice = async () => {
  const urlBinance = 'https://www.binance.com/api/v3/ticker/price?symbol=HBARUSDT';
  const response = await axios.get(urlBinance,  {
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
  });
  return response.data.price;
}

export const useExchangeHbarPrice = (pollTime = 0) => {
    const [price, setPrice] = useState(0);
    const pollPrice = useCallback(async () => {
      const newPrice = await getPrice();
      setPrice(newPrice);
    }, [price]);
    useOnRepetition(pollPrice, { pollTime});
    return price;
};
