const fs = require('fs')

// bytes
ROM = []
for (let i = 0; i < 8192; i++) {
  ROM.push(0)
}

// half-bytes
DRAM = [] // not to be confused with DRAM
for (let i = 0; i < 1024; i++) {
  DRAM.push(0)
}

// half-bytes
SRAM = [] // not to be confused with SRAM
for (let i = 0; i < 256; i++) {
  SRAM.push(0)
}

// half-bytes
REG = []
for (let i = 0; i < 16; i++) {
  REG.push(0)
}

function h2b (hex) {
  return parseInt(hex, 16).toString(2).padStart(8, '0')
}

function b2d (bin) {
  return parseInt(bin, 2).toString(10)
}

function s2b (str) {
  return parseInt(str, 2)
}

PC = 0
ACC = 0
CY = 0

const FN = {}

function runInstr (hex, arg='00') {
  const
    binstr = h2b(hex),
    opCode = binstr.slice(0, 4),
    modifier = binstr.slice(4, 8),
    binarg = h2b(arg);

  if (opCode == '0000') {
    if (modifier == '0000') {
      FN.NOP()
    } else if (modifier == '0001') {
      FN.HLT()
    } else if (modifier == '0010') {
      FN.BBS()
    } else if (modifier == '0011') {
      FN.LCR()
    } else if (modifier == '0100') {
      FN.OR4()
    } else if (modifier == '0101') {
      FN.OR5()
    } else if (modifier == '0110') {
      FN.AN6()
    } else if (modifier == '0111') {
      FN.AN7()
    } else if (modifier == '1000') {
      FN.DB0()
    } else if (modifier == '1001') {
      FN.DB1()
    } else if (modifier == '1010') {
      FN.SB0()
    } else if (modifier == '1011') {
      FN.SB1()
    } else if (modifier == '1100') {
      FN.EIN()
    } else if (modifier == '1101') {
      FN.DIN()
    } else if (modifier == '1110') {
      FN.RPM()
    } else {
      // Error
    }
  } else if (opCode == '0001') {
    FN.JCN(modifier, binarg)
  } else if (opCode == '0010') {
    if (modifier[3] == '0') {
      FN.FIM(modifier.slice(0, 3), binarg)
    } else if (modifier[3] == '1') {
      FN.SRC(modifier.slice(0, 3))
    } else {
      // ERROR
    }
  } else if (opCode == '0011') {
    if (modifier[3] == '0') {
      FN.FIN(modifier.slice(0, 3))
    } else if (modifier[3] == '1') {
      FN.JIN(modifier.slice(0, 3))
    } else {
      // ERROR
    }
  } else if (opCode == '0100') {
    FN.JUN(modifier, binarg)
  } else if (opCode == '0101') {
    FN.JMS(modifier, binarg)
  } else if (opCode == '0110') {
    FN.INC(modifier)
  } else if (opCode == '0111') {
    FN.ISZ(modifier, binarg)
  } else if (opCode == '1000') {
    FN.ADD(modifier)
  } else if (opCode == '1001') {
    FN.SUB(modifier)
  } else if (opCode == '1010') {
    FN.LD(modifier)
  } else if (opCode == '1011') {
    FN.XCH(modifier)
  } else if (opCode == '1100') {
    FN.BBL(modifier)
  } else if (opCode == '1101') {
    FN.LDM(modifier)
  } else if (opCode == '1110') {
    if (modifier == '0000') {
      FN.WRM()
    } else if (modifier == '0001') {
      FN.WMP()
    } else if (modifier == '0010') {
      FN.WRR()
    } else if (modifier == '0100') {
      FN.WR0()
    } else if (modifier == '0101') {
      FN.WR1()
    } else if (modifier == '0110') {
      FN.WR2()
    } else if (modifier == '0111') {
      FN.WR3()
    } else if (modifier == '1000') {
      FN.SBM()
    } else if (modifier == '1001') {
      FN.RDM()
    } else if (modifier == '1010') {
      FN.RDR()
    } else if (modifier == '1011') {
      FN.ADM()
    } else if (modifier == '1100') {
      FN.RD0()
    } else if (modifier == '1101') {
      FN.RD1()
    } else if (modifier == '1110') {
      FN.RD2()
    } else if (modifier == '1111') {
      FN.RD3()
    } else {
      // ERROR
    }
  } else if (opCode == '1111') {
    if (modifier == '0000') {
      FN.CLB()
    } else if (modifier == '0001') {
      FN.CLC()
    } else if (modifier == '0010') {
      FN.IAC()
    } else if (modifier == '0011') {
      FN.CMC()
    } else if (modifier == '0100') {
      FN.CMA()
    } else if (modifier == '0101') {
      FN.RAL()
    } else if (modifier == '0110') {
      FN.RAR()
    } else if (modifier == '0111') {
      FN.TCC()
    } else if (modifier == '1000') {
      FN.DAC()
    } else if (modifier == '1001') {
      FN.TCS()
    } else if (modifier == '1010') {
      FN.STC()
    } else if (modifier == '1011') {
      FN.DAA()
    } else if (modifier == '1100') {
      FN.KBP()
    } else if (modifier == '1101') {
      FN.DCL()
    } else {
      // ERROR
    }
  } else {
    // ERROR
  }
}

FN.NOP = () => { return }
FN.HLT = () => { return }
FN.BBS = () => { return }
FN.LCR = () => { return }
FN.OR4 = () => { return }
FN.OR5 = () => { return }
FN.AN6 = () => { return }
FN.AN7 = () => { return }
FN.DB0 = () => { return }
FN.DB1 = () => { return }
FN.SB0 = () => { return }
FN.SB1 = () => { return }
FN.EIN = () => { return }
FN.DIN = () => { return }
FN.RPM = () => { return }
FN.JCN = (modifier, binarg) => { return }
FN.FIM = (modifier, binarg) => { return }
FN.SRC = (modifier) => { return }
FN.FIN = (modifier) => { return }
FN.JIN = (modifier) => { return }
FN.JUN = (modifier, binarg) => { return }
FN.JMS = (modifier, binarg) => { return }
FN.INC = (modifier) => { return }
FN.ISZ = (modifier, binarg) => { return }
FN.ADD = (modifier) => { return }
FN.SUB = (modifier) => { return }
FN.LD = (modifier) => { return }

// Exchange
// echange contents of register with accumulator
FN.XCH = (register) => {
  console.log('XCH', register)
  const
    i = s2b(register),
    tmp = REG[i]

  REG[i] = ACC
  ACC = tmp
}

FN.BBL = (modifier) => { return }

// Load Immediate
// load data to the accumulator
FN.LDM = (data) => {
  console.log('LDM', data)
  ACC = s2b(data)
}

FN.WRM = () => { return }
FN.WMP = () => { return }
FN.WRR = () => { return }
FN.WR0 = () => { return }
FN.WR1 = () => { return }
FN.WR2 = () => { return }
FN.WR3 = () => { return }
FN.SBM = () => { return }
FN.RDM = () => { return }
FN.RDR = () => { return }
FN.ADM = () => { return }
FN.RD0 = () => { return }
FN.RD1 = () => { return }
FN.RD2 = () => { return }
FN.RD3 = () => { return }
FN.CLB = () => { return }
FN.CLC = () => { return }
FN.IAC = () => { return }
FN.CMC = () => { return }
FN.CMA = () => { return }
FN.RAL = () => { return }
FN.RAR = () => { return }
FN.TCC = () => { return }
FN.DAC = () => { return }
FN.TCS = () => { return }
FN.STC = () => { return }
FN.DAA = () => { return }
FN.KBP = () => { return }
FN.DCL = () => { return }

const bin = fs.readFileSync('./hello_world.bin').toString('utf-8').split('\n').join(' ').split(' ')
console.log(bin);

for (const instr of bin) {
  runInstr(instr)
}

console.log(REG)
