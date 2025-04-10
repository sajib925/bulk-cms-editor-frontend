import CollectionTable from "./components/CollectionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function App() {

  return (
    <main className={"max-w-full overflow-hidden text-white"}>
      <div className="md:p-10">
        
        <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="feedback">feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <CollectionTable />
        </TabsContent>
        <TabsContent value="feedback">
          <h1>this is feedback page</h1>
        </TabsContent>
      </Tabs>
      </div>
    </main>
  );
}

export default App;
