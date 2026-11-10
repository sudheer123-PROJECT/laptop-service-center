#define MyAppName "Laptop Service Center"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Laptop Service Center"
#define MyAppExeName "LaptopServiceCenter.exe"

[Setup]
AppId={{A83D2A4D-5F28-4D2A-9E21-123456789001}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}

DefaultDirName={autopf}\Laptop Service Center
DefaultGroupName={#MyAppName}

OutputDir=installer
OutputBaseFilename=Laptop_Service_Center_Setup

Compression=lzma
SolidCompression=yes
WizardStyle=modern

PrivilegesRequired=admin

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; \
Description: "Create a desktop shortcut"; \
GroupDescription: "Additional icons:"

[Files]
Source: "backend\dist\LaptopServiceCenter\*"; \
DestDir: "{app}"; \
Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; \
Filename: "{app}\{#MyAppExeName}"

Name: "{commondesktop}\{#MyAppName}"; \
Filename: "{app}\{#MyAppExeName}"; \
Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; \
Description: "Launch {#MyAppName}"; \
Flags: nowait postinstall skipifsilent