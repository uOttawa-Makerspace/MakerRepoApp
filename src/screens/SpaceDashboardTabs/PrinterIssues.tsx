export type PrinterIssue = {
    id: number
    printer_id: number;
    printer_name: string; // just a cache
    summary: string;
    description: string;
    reporter: string; // Just take the reporter name
    created_at: string;
}

type PrinterIssuesProps = {
    issues: PrinterIssue[];
}

const PrinterIssues: React.FC<PrinterIssuesProps> = ({issues}) => {
    return (<>
        <h3 className="text-center mt-2">Issues</h3>
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <td>Printer</td>
                        <td>Summary</td>
                        <td>Created at</td>
                    </tr>
                </thead>
                <tbody>
                    {issues.map((i) =>
                        <tr>
                            <td>{i.printer_name}</td>
                            <td>{i.summary}</td>
                            <td>{i.created_at}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
        <h3 className="text-center mt-2">Closed Issues</h3>
    </>)
}

export default PrinterIssues;
