@echo off
cd /d "e:\F\Des\IHM_Plw_Automation"
node "node_modules\@playwright\test\cli.js" test tests/ui/seller-registration.spec.ts --headed --reporter=list > run_output.txt 2>&1
echo EXITCODE=%ERRORLEVEL% >> run_output.txt
