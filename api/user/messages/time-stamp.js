<?php
class get_time_Stamp{
    public $time_yesterday="Yesterday"; //-----day ago
    public $day_ago="day ago";
    public $days_ago="days ago";
    public $week_ago="last week";
    public $weeks_ago="weeks ago";
    public $month_ago="last month";
    public $months_ago="months ago";
    public function get_output_Time($temp_date,$temp_time){
        $year = date('Y');
        $month = date('M');
        $day = date('d');
        $present_date=$day."-".$month."-".$year;
        $new_date=str_replace(" ","",$temp_date);
        $temp_year=explode("-",$new_date)[0];
        $temp_month=explode("-",$new_date)[1];
        $temp_day=explode("-",$new_date)[2];
        $yesterday=date("d-M-Y",strtotime("yesterday"));
        if($present_date==$new_date){
            return "Today, ".$temp_time;
        }else if($new_date==$yesterday){ //------------if its yesterday,,,,
            return "Yesterday, ".$temp_time;
        }else{
            if($year==$temp_year){
                if($month==$temp_month){ //------------if the message month is in the present
                    if($day==$temp_day){
                        return $temp_time;
                    }else{
                        return date('D',strtotime($temp_year."-".$temp_month."-".$temp_day)).", ".$temp_date;;
                    }
                }else{
                    return date('D',strtotime($temp_year."-".$temp_month."-".$temp_day)).", ".$temp_date;
                }
            }else{
                return date('D',strtotime($temp_year."-".$temp_month."-".$temp_day)).", ".$temp_date;
            }
        }
    }
}
class get_time_stamp_Inchat{
    public $time_yesterday="Yesterday"; //-----day ago
    public $day_ago="day ago";
    public $days_ago="days ago";
    public $week_ago="last week";
    public $weeks_ago="weeks ago";
    public $month_ago="last month";
    public $months_ago="months ago";
    public function get_output_Time($temp_date,$temp_time){
        $year = date('Y');
        $month = date('M');
        $day = date('d');
        $present_date=$day."-".$month."-".$year;
        $new_date=str_replace(" ","",$temp_date);
        $temp_year=explode("-",$new_date)[0];
        $temp_month=explode("-",$new_date)[1];
        $temp_day=explode("-",$new_date)[2];
        $yesterday=date("d-M-Y",strtotime("yesterday"));
        if($present_date==$new_date){
            return "Today";
        }else if($new_date==$yesterday){ //-----------if its yesterday
            return "Yesterday";
        }else{
            if($year==$temp_year){
                if($month==$temp_month){ //-----------if the message month is in the present
                    if($day==$temp_day){
                        return $temp_time;
                    }else{
                        return date('D',strtotime($temp_year."-".$temp_month."-".$temp_day)).", ".$temp_date;
                    }
                }else{
                    return date('D',strtotime($temp_year."-".$temp_month."-".$temp_day)).", ".$temp_date;
                }
            }else{
                return date('D',strtotime($temp_year."-".$temp_month."-".$temp_day)).", ".$temp_date;
            }
        }
    }
}
?>
