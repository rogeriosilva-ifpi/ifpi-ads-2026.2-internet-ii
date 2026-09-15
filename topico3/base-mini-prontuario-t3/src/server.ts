/** Liga a máquina. Só isso — a montagem inteira mora em app.ts. */
import { app } from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Mini-Prontuário T3 no ar em http://localhost:${PORT}`);
});
