import ReactHtmlParser from "react-html-parser";
import {Skeleton} from "@mui/material";

export function SpaceHourCard(props: { hour: any; }) {

    const valueOrSkeleton = (value: string, variant: string = 'text', width?: number | string, height?: number | string, applyFunc?: ((arg0: any) => any) | undefined) => {
        let items = props.hour

        try {
            value.split('.').forEach((item) => {
                items = items[item]
            });
        } catch (e) {
            // @ts-ignore
            return <Skeleton variant={variant} width={width} height={height} />
        }

        if (items) {
            if (applyFunc) {
                return applyFunc(items)
            } else {
                return items;
            }
        } else {
            // @ts-ignore
            return <Skeleton variant={variant} width={width} height={height} />
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">{ valueOrSkeleton('name') }</h4>
                <h6 className="card-subtitle mb-2">{ valueOrSkeleton('email') }</h6>
                <h6 className="card-subtitle mb-2">{ valueOrSkeleton('address') }</h6>
                <h6 className="card-subtitle mb-2">{ valueOrSkeleton('phone_number') }</h6>
                <ul className="list-group">
                    <div>
                        <div className="card-header">
                            Students
                        </div>
                        <div className="card-body">
                            {valueOrSkeleton('opening_hour.students', 'rectangular', undefined, 150, ReactHtmlParser)}
                        </div>
                    </div>
                    <div>
                        <div className="card-header">
                            Public
                        </div>
                        <div className="card-body">
                            {valueOrSkeleton('opening_hour.public', 'text', undefined, undefined, ReactHtmlParser)}
                        </div>
                    </div>
                    <div>
                        <div className="card-header">
                            Summer
                        </div>
                        <div className="card-body">
                            {valueOrSkeleton('opening_hour.summer', 'text', undefined, undefined, ReactHtmlParser)}
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    )
}