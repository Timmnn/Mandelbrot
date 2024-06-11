import "./style.css";

class ComplexNumber {
   public real: number;
   public imaginary: number;

   constructor(real: number, imaginary: number) {
      this.real = real;
      this.imaginary = imaginary;
   }

   add(other: ComplexNumber): ComplexNumber {
      return new ComplexNumber(this.real + other.real, this.imaginary + other.imaginary);
   }

   subtract(other: ComplexNumber): ComplexNumber {
      return new ComplexNumber(this.real - other.real, this.imaginary - other.imaginary);
   }

   multiply(other: ComplexNumber): ComplexNumber {
      return new ComplexNumber(
         this.real * other.real - this.imaginary * other.imaginary,
         this.real * other.imaginary + this.imaginary * other.real
      );
   }

   divide(other: ComplexNumber): ComplexNumber {
      const denominator = other.real ** 2 + other.imaginary ** 2;
      return new ComplexNumber(
         (this.real * other.real + this.imaginary * other.imaginary) / denominator,
         (this.imaginary * other.real - this.real * other.imaginary) / denominator
      );
   }

   abs(): number {
      return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
   }
}

class Gradient {
   private colors: string[];

   constructor(colors: string[]) {
      this.colors = colors;
   }

   getColor(value: number): string {
      // Clamp value between 0 and 1
      const index = Math.floor(value * (this.colors.length - 1));
      return this.colors[index];
   }

   debugOutput() {
      for (let i = 0; i < 1; i += 0.01) {
         console.log(this.getColor(i));
         const el = document.createElement("div");
         el.style.width = "100px";
         el.style.height = "100px";
         el.style.backgroundColor = this.getColor(i);
         document.body.appendChild(el);
      }
   }
}

function getMandelbrotValueAtPosition(x: number, y: number, maxIterations: number): number {
   // Mandelbrot set: z = z^2 + c
   // c = x + yi
   // z = 0
   const c = new ComplexNumber(x, y);
   let z = new ComplexNumber(0, 0);

   for (let i = 1; i <= maxIterations; i++) {
      z = z.multiply(z).add(c);

      if (z.abs() > 2) return i / maxIterations;
   }

   return 1;
}

function generateSet(
   x_start: number,
   x_end: number,
   y_start: number,
   y_end: number,
   squareWidth: number,
   squareHeight: number,
   maxIterations: number
): number[][] {
   const set: number[][] = new Array(Math.ceil((x_end - x_start) / squareWidth))
      .fill(null)
      .map(() => new Array(Math.ceil((y_end - y_start) / squareHeight)).fill("a"));

   const calculations = set.length * set[0].length;
   let finished = 0;

   let x_coord = x_start;
   for (let x_index = 0; x_index < set.length; x_index++) {
      let y_coord = y_start;

      for (let y_index = 0; y_index < set[x_index].length; y_index++) {
         set[x_index][y_index] = getMandelbrotValueAtPosition(x_coord, y_coord, maxIterations);

         finished++;

         if (finished % (calculations / 10) === 0) {
            console.log(
               `Finished ${finished} out of ${calculations} (${Math.floor(
                  (finished / calculations) * 100
               )}%)`
            );
         }
         y_coord += squareHeight;
      }
      x_coord += squareWidth;
   }

   return set;
}

function drawSet(
   options: {
      max_iterations?: number;
      box_count?: number;
      from_x?: number;
      to_x?: number;
      from_y?: number;
      to_y?: number;
   } = {}
) {
   const canvas = document.querySelector("canvas");

   if (!canvas) throw "No canvas found";

   const ctx = canvas.getContext("2d");

   if (!ctx) throw "No context found";

   ctx.fillStyle = "black";

   ctx.fillRect(0, 0, canvas.width, canvas.height);

   const autoSetIterations =
      document.querySelector<HTMLInputElement>("#auto-set-iterations")?.checked;

   const maxIterations =
      options.max_iterations ||
      document.querySelector<HTMLInputElement>("#iterations")?.valueAsNumber ||
      100;

   const boxCountX = document.querySelector<HTMLInputElement>("#box-count")?.valueAsNumber || 100;

   let fromX = options.from_x;
   if (typeof fromX !== "number")
      fromX = document.querySelector<HTMLInputElement>("#from-x")?.valueAsNumber;
   if (typeof fromX !== "number") fromX = -2;

   let toX = options.to_x;
   if (typeof toX !== "number")
      toX = document.querySelector<HTMLInputElement>("#to-x")?.valueAsNumber;
   if (typeof toX !== "number") toX = 2;

   let fromY = options.from_y;
   if (typeof fromY !== "number")
      fromY = document.querySelector<HTMLInputElement>("#from-y")?.valueAsNumber;
   if (typeof fromY !== "number") fromY = -2;

   let toY = options.to_y;
   if (typeof toY !== "number")
      toY = document.querySelector<HTMLInputElement>("#to-y")?.valueAsNumber;
   if (typeof toY !== "number") toY = 2;

   const boxSizeX = (toX - fromX) / boxCountX;
   const boxSizeY = (toY - fromY) / boxCountX;

   let set = generateSet(fromX, toX, fromY, toY, boxSizeX, boxSizeY, maxIterations);

   canvas.width = canvas.clientWidth;
   canvas.height = canvas.clientHeight;

   const box_height = canvas.height / set.length;
   const box_width = canvas.width / set[0].length;

   const grad = new Gradient([
      "#000505",
      "#000A0A",
      "#001010",
      "#001515",
      "#001A1A",
      "#002020",
      "#002525",
      "#002A2A",
      "#003030",
      "#003535",
      "#003A3A",
      "#004040",
      "#004545",
      "#004A4A",
      "#005050",
      "#005555",
      "#005A5A",
      "#006060",
      "#006565",
      "#006A6A",
      "#007070",
      "#007575",
      "#007A7A",
      "#008080",
      "#008585",
      "#008A8A",
      "#009090",
      "#009595",
      "#009A9A",
      "#00A0A0",
      "#00A5A5",
      "#00AAAA",
      "#00B0B0",
      "#00B5B5",
      "#00BABA",
      "#00C0C0",
      "#00C5C5",
      "#00CACA",
      "#00D0D0",
      "#00D5D5",
      "#00DADA",
      "#00E0E0",
      "#00E5E5",
      "#00EAEA",
      "#00F0F0",
      "#00F5F5",
      "#00FAFA",
      "#00FFFF",
      "#05FFFF",
      "#0AFFFF",
      "#0FFFFF",
      "#14FFFF",
      "#19FFFF",
      "#1EFFFF",
      "#23FFFF",
      "#28FFFF",
      "#2DFFFF",
      "#32FFFF",
      "#37FFFF",
      "#3CFFFF",
      "#41FFFF",
      "#46FFFF",
      "#4BFFFF",
      "#50FFFF",
      "#55FFFF",
      "#5AFFFF",
      "#5FFFFF",
      "#64FFFF",
      "#69FFFF",
      "#6EFFFF",
      "#73FFFF",
      "#78FFFF",
      "#7DFFFF",
      "#82FFFF",
      "#87FFFF",
      "#8CFFFF",
      "#91FFFF",
      "#96FFFF",
      "#9BFFFF",
      "#A0FFFF",
      "#A5FFFF",
      "#AAFFFF",
      "#AFFFFF",
      "#B4FFFF",
      "#B9FFFF",
      "#BEFFFF",
      "#C3FFFF",
      "#C8FFFF",
      "#CDFFFF",
      "#D2FFFF",
   ]);

   let cells = set.length * set[0].length;
   let drawn = 0;

   for (let x = 0; x < set.length; x++) {
      for (let y = 0; y < set[x].length; y++) {
         if (set[x][y]) {
            ctx.fillStyle = grad.getColor(set[x][y]);
            ctx.fillRect(x * box_width, y * box_height, box_width * 1.2, box_height * 1.2);
         }

         drawn++;

         if (drawn % (cells / 10) === 0) {
            console.log(`Drawn ${drawn} out of ${cells} (${Math.floor((drawn / cells) * 100)}%)`);
         }
      }
   }
}

// Keyboard shortcuts
document.addEventListener("keydown", e => {
   switch (e.key) {
      case "+":
         zoom(0.1);
         break;
      case "-":
         zoom(-0.1);
         break;
      case "ArrowUp":
      case "w":
         move(0, -0.1);
         break;
      case "ArrowDown":
      case "s":
         move(0, 0.1);
         break;
      case "ArrowLeft":
      case "a":
         move(-0.1, 0);
         break;
      case "ArrowRight":
      case "d":
         move(0.1, 0);
         break;
   }
});

document.addEventListener("wheel", e => {
   if (e.deltaY > 0) {
      zoom(-0.1);
   } else {
      zoom(0.1);
   }
});

function roundToDecimals(num: number, decimals: number) {
   return Math.round(num * 10 ** decimals) / 10 ** decimals;
}

function zoom(scale: number) {
   let fromX = document.querySelector<HTMLInputElement>("#from-x")?.valueAsNumber;
   let toX = document.querySelector<HTMLInputElement>("#to-x")?.valueAsNumber;
   let fromY = document.querySelector<HTMLInputElement>("#from-y")?.valueAsNumber;
   let toY = document.querySelector<HTMLInputElement>("#to-y")?.valueAsNumber;

   if (fromX === undefined || toX === undefined || fromY === undefined || toY === undefined) {
      return;
   }

   let xDiff = toX - fromX;
   let yDiff = toY - fromY;

   const new_from_x = roundToDecimals(fromX + xDiff * scale, 10);
   const new_to_x = roundToDecimals(toX - xDiff * scale, 10);
   const new_from_y = roundToDecimals(fromY + yDiff * scale, 10);
   const new_to_y = roundToDecimals(toY - yDiff * scale, 10);

   document.querySelector<HTMLInputElement>("#from-x")!.value = new_from_x.toString();
   document.querySelector<HTMLInputElement>("#to-x")!.value = new_to_x.toString();
   document.querySelector<HTMLInputElement>("#from-y")!.value = new_from_y.toString();
   document.querySelector<HTMLInputElement>("#to-y")!.value = new_to_y.toString();

   drawSet();
}

function move(x: number, y: number) {
   let fromX = document.querySelector<HTMLInputElement>("#from-x")?.valueAsNumber;
   let toX = document.querySelector<HTMLInputElement>("#to-x")?.valueAsNumber;
   let fromY = document.querySelector<HTMLInputElement>("#from-y")?.valueAsNumber;
   let toY = document.querySelector<HTMLInputElement>("#to-y")?.valueAsNumber;

   if (fromX === undefined || toX === undefined || fromY === undefined || toY === undefined) {
      return;
   }

   let xDiff = toX - fromX;
   let yDiff = toY - fromY;

   console.log((fromX + xDiff * x).toString());

   document.querySelector<HTMLInputElement>("#from-x")!.value = (fromX + xDiff * x).toString();
   document.querySelector<HTMLInputElement>("#to-x")!.value = (toX + xDiff * x).toString();
   document.querySelector<HTMLInputElement>("#from-y")!.value = (fromY + yDiff * y).toString();
   document.querySelector<HTMLInputElement>("#to-y")!.value = (toY + yDiff * y).toString();

   drawSet();
}

// @ts-ignore
window.drawSet = drawSet;
// @ts-ignore
window.zoom = zoom;
// @ts-ignore
window.move = move;

window.onload = () => {
   drawSet();
   alert(
      "Use the arrow keys to move around and the + and - keys or mouse wheel to zoom in and out."
   );
};
