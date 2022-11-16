import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "antd/dist/antd.css";
import Calendar from "../calendar/calendar";
import React, { useState } from "react";
import { addDays, eachDayOfInterval, isWeekend } from "date-fns";
import { DateRange } from "react-date-range";
import moment from "moment";
import { Select } from "antd";
import axios from "axios";

export default function Home() {
  const { Option } = Select;
  const currentRange = React.useRef(null);
  const [allDate, setAllDate] = useState<any>([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [formatDate, setFormatDate] = useState<any[]>([]);
  const [excludedDay, setExcludedDay] = useState<any[]>([]);
  const [selectedHours, setSelectedHours] = useState<any[]>([]);
  const [aviableDay, setAviableDay] = useState<any[]>([]);

  const onExcludeDate = (newValue: string[]) => {
    console.log("excludedDay ", newValue);
    setExcludedDay(newValue);
  };

  const onSelectHours = (newValue: string[]) => {
    console.log("hoursSelected", newValue);
    setSelectedHours(newValue);
  };

  const day = [
    {
      label: "Domenica",
      value: "1",
    },
    {
      label: "Lunedi",
      value: "2",
    },
    {
      label: "Martedi",
      value: "3",
    },
  ];

  const hours: any[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 2; j++) {
      hours.push(`${i}:${j === 0 ? `00` : 30 * j}`);
    }
  }

  function getDatesInRange(startDate = Date.now(), endDate = Date.now()) {
    return eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });
  }

  // const disabledDates = calcWeekends(new Date(), addDays(new Date(), 100))

  function disabledDate(current: any) {
    // Can not select days before today and today
    let disabledDate = [];
    return (disabledDate = current.filter(
      (el: moment.MomentInput) => moment(el).day() !== 1
    ));
  }

  const getCalendar = () => {
    return axios.get("/api/getCalendar").then((res) => {
      console.table(res.data);
    });
  };

  React.useEffect(() => {
    console.log(getDatesInRange(allDate[0].startDate, allDate[0].endDate));

    setFormatDate(getDatesInRange(allDate[0].startDate, allDate[0].endDate));

    console.log(
      disabledDate(getDatesInRange(allDate[0].startDate, allDate[0].endDate))
    );
  }, [allDate]);

  React.useEffect(() => {
    console.log(formatDate.map((el) => moment(el).format("DDMM")));
  }, [formatDate]);

  React.useEffect(() => {}, [formatDate]);

  console.log(Calendar);
  return (
    <div>
      {/* <span onClick={()=>getCalendar()}>get calendar</span> */}
      {/* <RangePicker 
      onChange={(item,d) => setState([d])}
      /> */}
      <DateRange
        ref={currentRange}
        onChange={(item) => setAllDate([item.selection])}
        // disabledDay={
        //   disabledDates
        // }
        // moveRangeOnFirstSelection={false}
        minDate={addDays(new Date(), 0)}
        maxDate={addDays(new Date(), 60)}
        months={1}
        ranges={allDate}
        moveRangeOnFirstSelection={false}
        direction="vertical"
        scroll={{ enabled: true }}
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={selectedHours}
        onChange={onExcludeDate}
      >
        {day.map((el, i) => (
          <Option value={el.value} label={el.label} key={i}>
            {" "}
            {el.label}
          </Option>
        ))}
      </Select>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={onSelectHours}
      >
        {hours.map((el, i) => (
          <Option value={el} label={el} key={i}>
            {el}
          </Option>
        ))}
      </Select>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={onSelectHours}
      >
        {hours.map((el, i) => (
          <Option value={el} label={el} key={i}>
            {el}
          </Option>
        ))}
      </Select>
    </div>
  );
}
